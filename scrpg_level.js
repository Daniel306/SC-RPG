// call this to check level up
// returns a promise and will the screen if leveled up
let checkLevelUp = () => new Promise((resolve) => {
  var p = GS.player;
  let levelBefore = p.level;
  while (p.exp >= p.goalExp) {
    p.exp -= p.goalExp;
    p.level ++;
    p.goalExp = levelToExpFormula(p.level);
  }

  if (levelBefore != p.level) {
    let levelGain = p.level - levelBefore;
    cls();
    t("Level Up!")
    t("Level " + levelBefore + " -> " + p.level);

    p.statPoints += levelGain;

    t(`You gained ${levelGain} stat points!`);
    return anykey()
      .then(spentStatPoints)
      .then(resolve);
  } else {
    resolve();
  }
});

let spentStatPoints = () => new Promise((resolve) => {
  let p = GS.player;
  if (p.statPoints) {
    cls();
    t(`You have ${p.statPoints} stat points`);

    [["micro", "Micro"], ["macro", "Macro"], ["strat", "Strategy"]].forEach((obj) => {
      let stat = obj[0];
      let statName = obj[1];

      bt("Improve " + statName, () => {
        p[stat] ++;
        p.statPoints --;

        cls();
        t(statName + " incrased! (" + (p[stat] - 1) + " -> " + p[stat] + ")");
        anykey().then(spentStatPoints).then(resolve);
      });
    });

    t("");
    bt("Decide Next Level", resolve);
    redraw();
  } else {
    resolve();
  }
});
