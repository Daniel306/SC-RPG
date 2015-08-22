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

  let totalPlayers = playerData.length;

  let renderBattle = function() {
    cls();
    for (let team of teamData) {
      for(let p of team.players) {
        if (p.dead)
          t("name", p.player.name, " - is dead")  
        else
          t("name", p.player.name, " eco", p.resource, " troop", p.troop)
      }
      t("");
    };
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

        // gg logic, only happens after fight
        if ((p.resource  / e.resource  > 8 && p.resource - e.resource > 10)
            || (p.troop / e.troop > 8 && p.troop - e.troop > 10)) {
          e.dead = true;
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

    renderBattle();
    battleStepTimeoutId = setTimeout(battleStep, 10);
  };

  battleStep();
  return promise;
};