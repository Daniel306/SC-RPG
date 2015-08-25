(function(exports) {


let giveEnergy = (toGive) => {
  GS.player.energy = Math.min(GS.player.energy + toGive, GS.player.maxEnergy);
}

let ITEM_DATA = [
  {name: "tea",      desc: "A drink for real men. gives 20 energy"      , effect: ()=>giveEnergy(20)},
  {name: "coffee",   desc: "Perfectly roasted, gives 40 energy"         , effect: ()=>giveEnergy(40)},
  {name: "red bull", desc: "Rud bull gives you wins, provides 60 energy", effect: ()=>giveEnergy(60)},
];

let getItemByName = (name) => {
  let itemsWithThatName = ITEM_DATA.filter((item) => item.name == name);
  return itemsWithThatName.length ? itemsWithThatName[0]: null;
}

exports.getItemByName = getItemByName;
exports.ITEM_DATA = ITEM_DATA;

})(window);


