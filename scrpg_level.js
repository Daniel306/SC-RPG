// call this to check level up
// returns a promise and will the screen if leveled up
function checkLevelUp() {
  let promiseResolve = null;
  let promise = new Promise((resolve) => promiseResolve = resolve);

  var p = GS.player;
  let levelBefore = p.level;
  while (p.exp >= p.goalExp) {
    p.exp -= p.goalExp;
    p.level ++;
    p.goalExp = levelToExpFormula(p.level);
  }

  if (levelBefore != p.level) {
    let levelGain = p.level - levelBefore;
    t("Level Up!")
    t("Level " + levelBefore + " -> " + p.level);

    p.statPoints += levelGain;
    p.racePoints += levelGain;

    t(`You gained ${levelGain} stat points!`);
    t(`You gained ${levelGain} race points!`);
    return anykey()
      .then(spentStatPoints)
      .then(spentRacePoint)
      .then(promiseResolve);
  } else {
    promiseResolve();
  }

  return promise;
}

function spentStatPoints() {
  let promiseResolve = null;
  let promise = new Promise((resolve) => promiseResolve = resolve);

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
        anykey().then(spentStatPoints).then(promiseResolve);
      });
    });

    t("");
    bt("Decide Later", promiseResolve);
    redraw();
  } else {
    promiseResolve();
  }

  return promise;
}

function spentRacePoint() {
  let promiseResolve = null;
  let promise = new Promise((resolve) => promiseResolve = resolve);

  let p = GS.player;
  if (p.racePoints) {
    cls();
    t(`You have ${p.racePoints} race points`);

    [["t", "Terran"], ["p", "Protoss", "z", "Zerg"]].forEach((obj) => {
      let stat = obj[0];
      let statName = obj[1];

      bt("+1 vs " + statName, () => {
        p.skills[stat] ++;
        p.racePoints --;

        cls();
        t("You skill against " + statName + " has incrased! (" + (p.skills[stat] - 1) + " -> " + p.skills[stat] + ")");
        anykey().then(spentRacePoint).then(promiseResolve);
      });
    });

    t("");
    bt("Decide Later", promiseResolve);
    redraw();
  } else {
    promiseResolve();
  }

  return promise;
}