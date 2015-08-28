(function(exports) {

let expNeededPerStatPoint = (x) => {
  var exp = 50 + 10 * x + Math.pow(1.17, x);
  return Math.round(exp/2);
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
  var top = expNeededPerStatPoint(x) * 2;
  var bot = 5+ 0.5*x / Math.log(x+5);
  return Math.round(top/bot);
};

let newCharacter = function(name, race, energy, micro, macro, strat) { 
  return {
    name,
    race,
    energy,
    maxEnergy: energy,
    micro,
    macro,
    strat
  };
};

let newBoss = function(reward, ...otherParams) {
  var enemy = newCharacter(...otherParams);
  enemy.reward = reward;
  return enemy;
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
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5)
  );
};

let newPlayer = function() {
  let player = newCharacter("nameless", "t", 100, 5, 5, 5);
  _.extend(player, {
    level: 1,
    exp: 0,
    goalExp: levelToExpFormula(1),
    race: "t",
    cash: 100,
    saving: 0,
    statPoints: 0,
    inventory: ["coffee", "tea", "coffee"],
    equip: {
      left: null,
      right: null,
      desk: null
    }
  });
  return player;
};

let getTime = () => {
  let startTime = (new Date(2010, 6, 27)).getTime();
  return new Date(startTime + GS.time * 1000);
};

// try to pay for a task
let takeMoney = function(price, onEnough, onNotEnough){
  if (GS.player.cash >= price){
    GS.player.cash -= price;
    onEnough();
  } else {
    t("Not enough cash")
    if (onNotEnough) {
      onNotEnough();
    }
  };
}

let takeEnergy = function(energy, onEnough, onNotEnough) {
  if (GS.player.energy >= energy) {
    GS.player.energy -= energy;
    if (onEnough)
      return onEnough(energy);
  } else {
    if (onNotEnough)
      return onNotEnough(energy);
  }
}
// returns amount given
let giveEnergy = (toGive) => {
  let gain = Math.min(GS.player.maxEnergy - GS.player.energy, toGive);
  GS.player.energy += gain;
  return gain;
}

let newGame = () => {
  window.GS = {
    player: newPlayer(),
    time: 0,
    curBossIdx: 0,
    seed: Math.floor(Math.random() * 1000000)
  };
  createEvents(window.GS.seed);
};

_.extend(exports, {
  takeMoney,
  takeEnergy,
  giveEnergy,

  levelToExpFormula,
  opponentToExp,

  generatePlayer,
  newBoss,
  
  newGame,

  getTime,
});

})(window);


