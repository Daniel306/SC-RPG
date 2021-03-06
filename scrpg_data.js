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
  var name = Util.randomPickFromArray([
    "fish dude", "IlikePie", "IWannaBe", "theVeryBest",
    "no1everWas", "hivemind", "randomguy", "randomgirl",
    "randomfish", "notafish", "totallyafish", "chiquita",
    "not_a_Vege", "vegetable", "bananas", "asdf",
    "asdfasdf", "zergling", "hydralist", "ultraling",
    "123123", "123123asd", "711", "slime",
    "balrog", "red_snail", "blue_snail", "big_small",
    "white_mouse", "brown_mouse", "snail_mouse",
    "fish_mouse", "fish_fish", "mouse_fish", "iron",
    "calcium", "vitaminC", "peanut", "butter", "sandwich",
    "salt", "corn", "Palm Oil"
  ]);

  return newCharacter(
    name,
    Util.randomPickFromArray(["t", "p", "z"]), 
    Util.randint(40, 100), 
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5),
    Util.randint(skill, skill * 1.5)
  );
};

let newPlayer = function() {
  let player = newCharacter("nameless", "t", 100, 3, 3, 3);
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

let getGameTime = () => {
  let startTime = (new Date(2010, 6, 27)).getTime();
  return new Date(startTime + GS.time * 1000);
};

let moveTime = (days, hours = 0, minutes = 0) =>{
  GS.time += (((days*24+hours)*60)+minutes)*60;
}

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
    seed: Math.floor(Math.random() * 1000000),
    usedEventIds: []
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

  getGameTime,
  moveTime,
});

})(window);


