function battle(map, teams) {
  let promiseResolve = null;
  let promise = new Promise((resolve,reject)=> promiseResolve = resolve);

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
    let checkIfNaN = (p) => {
      if (isNaN(p.troop) || isNaN(p.resource)) {
        console.log("fuck");
      }
    };

    let roundTR = (p) => {
      p.resource = Math.max(0.0001, p.resource);
      p.troop = Math.max(0.00001, p.resource);
    };

    for (let p of playerData) {
      if (p.dead) {
        continue;
      }

      let pp = p.player;

      p.resource += (Math.log(pp.macro) / 5) * Math.random();
      p.troop += (Math.log(pp.macro) / 5) * Math.random() * (Math.pow(p.resource, 1.2) / 50);
      p.apm = pp.micro + pp.macro + 50 + randint(1, 50);

      // pick an enemy
      let possibleEnemies = p.team.enemies.filter ((e) => e.dead == false);
      if (possibleEnemies.length == 0) {
        continue;
      }
      let e = Util.randomPickFromArray(possibleEnemies);
      let ep = e.player;

      // fight logic
      if (Math.pow(1.05, p.troop * 2) > rand(2, 100)) {
        let troopUsed = rand(10, 90) / 100 * Math.min(p.troop, e.troop);

        let luck = rand(55, 135)/100;
        let attackBonus = (pp.skills[ep.race] + 100)/100;
        let killPercent = luck / attackBonus;

        e.troop -= troopUsed * killPercent;
        p.troop -= troopUsed;

        let rLost = troopUsed * killPercent * (pp.micro * luck) / (1+ep.micro) * 1.5;
        p.resource -= troopUsed / luck;
        e.resource -= rLost;

        roundTR(p);
        roundTR(e);

        log(pp.name + " attacks " + ep.name);

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
        return promiseResolve(i);
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
    bt(!!battleStepTimeoutId ? "Pause Game" : "Resume Game", () => {
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

    bt("Quit", () => {
      if (!!battleStepTimeoutId) {
        clearTimeout(battleStepTimeoutId);
      }
      log(GS.player.name + " has left the game", "#88f");
      renderBattle();
      promiseResolve(-1);
    });

    
    t(map + " " + timeText())
    t("");

    for (let team of teamData) {
      for(let p of team.players) {
        if (p.dead)
          formattedText(
            [p.player.name + " - dead", 0]
          )
        else
          formattedText(
            [p.player.name, 0], 
            ["econ " + Math.floor(p.resource), 15],
            ["units " +  Math.floor(p.troop), 25]
          )
      }
      t("");
    }
    
    for (let comment of commentaries) {
      ct(comment.color, comment.text);
    }
    m.redraw();
  };

  battleStep();
  return promise;
};