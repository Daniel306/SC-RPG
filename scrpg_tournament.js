let tournament = gameMenu(menu, () => {
  t("Welcome to SC Tournament");
  t("Who would you like to play against?");

  let bosses = [
    newBoss (100,   "Master Fish",   "t",  100, [5, 5, 5 ],  5,  5, 5),
    newBoss (200,   "Hax0r1",        "t",  120, [10, 10, 10 ],  10,  10, 10),
    newBoss (350,   "July_zerg",     "z",  150, [30, 30, 40 ],  45,  47, 45),
    newBoss (600,   "Stork[gm]",     "p",  180, [45, 45, 40 ],  50,  56, 43),
    newBoss (1000,  "[red]NaDa",     "t",  200, [45, 45, 45 ],  55,  65, 50),
    newBoss (1500,  "sAviOr[gm]",    "z",  220, [55, 55, 50 ],  75,  73, 50),
    newBoss (2500,  "n.Die_Jaedong", "z",  230, [65, 75, 100],  85,  85, 80),
    newBoss (4000,  "Bisu[Shield]",  "p",  250, [85, 85, 80 ],  90,  95, 75),
    newBoss (20000, "Slayer_Boxer",  "t",  300, [90, 80, 100],  100, 90, 100),
  ];

  let onWin = (boss, bossIdx) => {
    let isFirstWin = bossIdx == GS.curBossIdx;

    cls();
    t("You won!");
    t("");
    let expGain = opponentToExp(boss);
    if (!isFirstWin) {
      expGain /= 2;
    }

    t("You gained " + expGain + " experience");
    let p = GS.player;
    p.exp += expGain;
    t("Total experience: " + (p.exp - expGain) + "/" + p.goalExp + " -> " + p.exp + "/" + p.goalExp);
    return anykey().then(checkLevelUp).then(() => {
      cls();
      t(GS.player.name + " defeated " + boss.name + ".");
      if (isFirstWin) {
        var reward = boss.reward;
        t(GS.player.name + " is rewarded $" + reward + " (first win bonus).");
        GS.curBossIdx ++;
      } else {
        var reward = Math.floor(boss.reward / 5);
        t(GS.player.name + " is rewarded $" + reward);
      }
      p.cash += reward;

      return anykey();
    }).then(tournament);
  }

  let onLoss = (boss, bossIdx) => {
    cls();
    t("You lost against " + boss.name);
    return anykey().then(tournament);
  }

  bosses.forEach((boss, idx) => {
    if (idx <= GS.curBossIdx) {
      bt("Play Against " + boss.name, () => takeEnergy(1, () => {
        battle("Tournament Map", [
          [GS.player],
          [bosses[idx]]
        ]).then((winningTeam) => {
          if (winningTeam == 0) {
            return onWin(boss, idx);
          } else {
            return onLoss(boss, idx);
          }
        })
      }, () => {
        cls("");
        t("You are too tired... you should home and sleep");
        return anykey().then(menu);
      }));
    }
  });

});