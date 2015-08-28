let battle = (map, teams) => new Promise((resolve) => {
  let rand = Util.rand;
  let randint = Util.randint;

  // setup
  let teamData = teams.map((team) => {
    let td = {
    };

    td.players = team.map((player) => { 
      return {
        player: player,
        lost: false,
        troop: 1,
        resource: 1,
        apm: 0,
        dead: false,
        team: td
      }
    });
    return td;
  });

  let playerData = [];
  // setup enemies for each team
  teamData.forEach((team) => {
    playerData = [...playerData, ...(team.players)];

    let enemies = [];
    teamData.forEach((otherTeam) => {
      if (otherTeam != team)
        enemies = [...enemies, ...(otherTeam.players)];
    });
    
    team.enemies = enemies;
  });

  let gameTime = 0;
  let timeText = () => {
    let s = ("0" + gameTime%60).slice(-2);;
    let m = ("0" + Math.floor(gameTime/60)).slice(-2);
    return m + ":" + s;
  };

  // for clearTimeout
  let battleStepTimeoutId = null;
  let battleStep = function() {
    let roundTR = (p) => {
      p.resource = Math.max(0.0001, p.resource);
      p.troop = Math.max(0.00001, p.resource);
      p.player.energy = Math.max(p.player.energy, 0);
    };

    for (let p of playerData) {
      if (p.dead) {
        continue;
      }

      let pp = getEquipedPlayerStat(p.player);
      let pStratFactor = pp.strat * 0.03 + 1;

      p.resource += (Math.log(pp.macro * pStratFactor) / 5) * Math.random();
      p.troop += (Math.log(pp.macro * pStratFactor) / 5) * Math.random() * (Math.pow(p.resource, 1.2) / 50);

      // lose energy
      let pEnergyBefore = pp.energy;
      pp.energy -= 0.1;
      pp.energy = Math.max(pp.energy, 0);
      if (pEnergyBefore > 30 && pp.energy < 30) {
        log(pp.name + " is starting to get tired")
      }
      if (pEnergyBefore > 20 && pp.energy < 20) {
        log(pp.name + " is really tired, APM dropping")
        pStratFactor *= 0.8;
      }
      if (pEnergyBefore > 10 && pp.energy < 10) {
        log(pp.name + " is exhausted, will collapse soon")
        pStratFactor *= 0.5;
      }
      if (pp.energy == 0) {
        log(pp.name + ": gg", "#88f");
        log(pp + " has collapsed!");
        p.dead = true;
        continue;
      }

      // pick an enemy
      let possibleEnemies = p.team.enemies.filter ((e) => e.dead == false);
      if (possibleEnemies.length == 0) {
        continue;
      }
      let e = Util.randomPickFromArray(possibleEnemies);
      let ep = getEquipedPlayerStat(e.player);
      let eStratFactor = ep.strat * 0.03 + 1;

      // fight logic
      if (Math.pow(1.05, p.troop * 2) > rand(2, 100)) {
        let troopUsed = rand(10, 90) / 100 * Math.min(p.troop, e.troop);

        let luck = rand(60, 135)/100;
        let attackBonus = 1;

        // apply strat bonus
        let stratBonus = Util.randomPickProbList([
          ["attacks from high ground", 1.1],
          pp.strat,
          ["attacks from multiple directions", 1.2],
          Math.max(0, pp.strat - 5),
          ["attacks using highly upgraded units", 1.4],
          Math.max(0, pp.strat - 10),
          ["attacks using sophisticated unit combination", 1.6],
          Math.max(0, pp.strat - 15),
          null,
          50
        ]);

        if (stratBonus) {
          attackBonus *= stratBonus[1];
          log(pp.name + " " + stratBonus[0]);
        } else {
          log(pp.name + " attacks " + ep.name);
        }

        let killPercent = luck * attackBonus;
        let microFactor = (3 + pp.micro * pStratFactor) / (3 + ep.micro * eStratFactor);

        e.troop -= troopUsed * killPercent * microFactor;
        p.troop -= troopUsed / microFactor;

        p.resource -= troopUsed * luck;
        e.resource -= troopUsed * luck;

        p.player.energy -= 1/luck;
        e.player.energy -= luck;

        roundTR(p);
        roundTR(e);

        // gg logic, only happens after fight
        if ((p.resource  / e.resource  > 8 && p.resource - e.resource > 10)
            || (p.troop / e.troop > 8 && p.troop - e.troop > 10)) {
          e.dead = true;
          log(ep.name + ": gg", "#88f");
          log(ep.name + " has left the game", "#88f");
        }
      }
    };

    // game over logic
    for (let i=0 ;i<teamData.length; i++) {
      var team = teamData[i];
      if (team.enemies.filter((e) => !e.dead).length == 0) {
        // this team won
        renderBattle();
        return resolve(i);
      }
    }

    gameTime += 7;

    battleStepTimeoutId = setTimeout(battleStep, 50);
    renderBattle();
  };

  var commentaries = [];
  let log = function(text, color = "#000") {
    commentaries.unshift({
      text: timeText() + "   " + text,
      color
    });
    commentaries.length > 10 ? commentaries.pop() : null;
  };

  let renderBattle = function() {
    let formattedText = function(...args) {
      var s = "";
      args.forEach((arg) => {
        while (s.length < arg[1]) {
          s+="\xA0";
        }
        s = s.substring(0, arg[1]);
        s += arg[0];
      });
      return t(s);
    };

    cls();
    let pauseBt = bt(!!battleStepTimeoutId ? "Pause Game" : "Resume Game", () => {
      if (!!battleStepTimeoutId) {
        clearTimeout(battleStepTimeoutId);
        log(GS.player.name + " has paused the game", "#88f");
        battleStepTimeoutId = null;
        renderBattle();
      } else {
        log(GS.player.name + " has restarted the game", "#88f");
        battleStep();
      }
    });

    let quitBt = bt("Quit", () => {
      if (!!battleStepTimeoutId) {
        clearTimeout(battleStepTimeoutId);
      }
      log(GS.player.name + " has left the game", "#88f");
      renderBattle();
      resolve(-1);
    });

    pauseBt.inline = true;

    
    t(map + " " + timeText())
    t("");

    for (let team of teamData) {
      for(let p of team.players) {
        if (p.dead) {
          formattedText(
            [p.player.name + " - dead", 0]
          );
          formattedText(["", 0])
        } else {
          let energyPercent = Math.floor((p.player.energy/p.player.maxEnergy) * 100);
          formattedText(
            [p.player.name, 0],
            ["(" + energyPercent + "% Energy)", 15] 
          );
          formattedText(
            ["econ " + Math.floor(p.resource), 0],
            ["units " +  Math.floor(p.troop), 15]
          )          
        }
      }
      t("");
    }
    
    for (let comment of commentaries) {
      ct(comment.color, comment.text);
    }
    m.redraw();
  };

  battleStep();
});