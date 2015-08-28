let tournament = gameMenu(menu, () => {
  t("Welcome to SC Tournament");
  t("Who would you like to play against?");

  let bosses = [
    newBoss (100,   "Master Fish",   "t", 100,  5,  5,  5),
    newBoss (200,   "MortalOne",     "p", 120,  7,  7,  7),
    newBoss (350,   "July",          "z", 150, 10, 10, 10),
    newBoss (600,   "Stork",         "p", 180, 12, 12, 12),
    newBoss (1000,  "NaDa",          "t", 200, 15, 15, 15),
    newBoss (1500,  "Saviour",       "z", 220, 17, 17, 17),
    newBoss (2500,  "Jaedong",       "z", 230, 20, 20, 20),
    newBoss (4000,  "Bisu",          "p", 250, 25, 25, 25),
    newBoss (20000, "Boxer",         "t", 300, 30, 30, 30),
  ];

  let onGameWin = () => {
    cls();
    if (GS.time < 2592000) // before SC 2 comes out
      return vn(
        "Congratulations",
        "You won against the best SC player",
        "and usurped their position",
        "You did it before the release of SC2",
        "and managed to become a legend in time",
        "You will be forever remembered",
        "as the greatest SC player of all time!",
        "GOOD END"
      );
    else
      return vn(
        "Congratulations",
        "You won against the best SC player",
        "Sadly you were unable to become the legend you wished to be",
        "with SC2 coming out, no one cared about SC anymore",
        "but at least you won",
        "At least you can try again with SC2",
        "BAD END"
      );
  };

  let onWin = (boss, bossIdx) => {
    let isFirstWin = bossIdx == GS.curBossIdx;

    t("");
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

      if (GS.curBossIdx >= bosses.length) {
        return onGameWin();        
      } else {
        return anykey();
      }
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