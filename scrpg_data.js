(function(exports) {

let expNeededPerStatPoint = (x) => {
  var exp = 50 + 10 * x + Math.pow(1.17, x);
  return Math.round(exp);
};

let levelToExpFormula = (x) => {
  var total = 0;
  var s = 1;
  for (var i=x*s; i<(x+1)*s; i++) {
    total += expNeededPerStatPoint(i);
  }
  return total;
};

let opponentToExp = (e) => {
  let x = e.micro + e.macro + e.strat;
  var top = expNeededPerStatPoint(x);
  var bot = 5+ 0.5*x / Math.log(x+5);
  return Math.round(top/bot);
};

let newCharacter = function(name, race, energy, skills, micro, macro, strat) { 
  return {
    name,
    race,
    energy,
    maxEnergy: energy,
    skills: {"t": skills[0], "p": skills[1], "z": skills[2]},
    micro,
    macro,
    strat
  };
};

let newBoss = function(reward, ...otherParams) {
  var enemy = newCharacter(...otherParams);
  enemy.reward = reward;
  return player;
};

let generatePlayer = function(skill) {
  var name = Util.randomPickFromArray(["randomUser", "noob_killer", "fishtastic",
    "1337player", "LmFao_Master",
    "Zergling", "I R The_KING", "allThyBase",
    "Zeratul", "Cerebrate", "Overmind's mind",
    "Jim Raynor", "MyBase4Aiur", "Weee_Master"]);

  return newCharacter(
    name,
    Util.randomPickFromArray(["t", "p", "z"]), 
    100, 
    [
      Util.randint(skill, skill * 1.5),
      Util.randint(skill, skill * 1.5),
      Util.randint(skill, skill * 1.5)
    ],
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5)
  );
};

let newPlayer = function() {
  let player = newCharacter("nameless", "t", 20, [0,0,0], 5, 5, 5);
  _.extend(player, {
    level: 1,
    exp: 0,
    goalExp: levelToExpFormula(1),
    race: "t",
    cash: 20,
    saving: 0,
    statPoints: 0,
    racePoints: 0,
  });
  return player;
};

let GS = {
  player: newPlayer(),
};

// try to pay for a task  (could be learning something, or even putting money in bank)
let payFor = function(price, task){
  if (GS.player.cash >= price){
    GS.player.cash -= price;
    task();
  } else t("not enough cash");
}

exports.payFor = payFor;
exports.GS = GS;
exports.generatePlayer = generatePlayer;
exports.levelToExpFormula = levelToExpFormula;
exports.opponentToExp = opponentToExp;

})(window);


