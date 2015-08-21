(function(exports) {

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

let newEnemy = function(reward, ...otherParams) {
  var enemy = newCharacter(...otherParams);
  enemy.reward = reward;
  return player;
};

let newPlayer = function() {
  let player = newCharacter("nameless", "t", 100, [0,0,0], 5, 5, 5);
  _.extend(player, {
    level: 1,
    exp: 0,
    goalExp: 10,
    race: "t",
    cash: 20,
    saving: 0,
  });
  return player;
};

let GS = {
  player: newPlayer(),
};



exports.GS = GS;

})(window);


