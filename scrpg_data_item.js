(function(exports) {


let giveEnergy = (toGive) => {
  GS.player.energy = Math.min(GS.player.energy + toGive, GS.player.maxEnergy);
}

let ITEM_DATA = [
  {name: "tea",      type:"c",  price: 8,  desc: "A drink for real men. gives 20 energy"      , effect: ()=>giveEnergy(20)},
  {name: "coffee",   type:"c",  price: 20, desc: "Perfectly roasted, gives 40 energy"         , effect: ()=>giveEnergy(40)},
  {name: "red bull", type:"c",  price: 50, desc: "Rud bull gives you wins, provides 60 energy", effect: ()=>giveEnergy(60)},
];

let getItemByName = (name) => {
  let itemsWithThatName = ITEM_DATA.filter((item) => item.name == name);
  return itemsWithThatName.length ? itemsWithThatName[0]: null;
}

let displayItemData = (itemData) => {
  t(itemData.name);
  t("");
  t(itemData.desc);
  t("")
}

let consumeItem = (itemData) => {
  let promiseResolve = null;
  let promise = new Promise((resolve) => promiseResolve = resolve);

  t("Comsuming " + itemData.name);
  return wasteTime(1000).then(() => {
    t("You consumed " + itemData.name + ".");
    itemData.effect();
    promiseResolve();
  });
  
  return promise;
};

exports.getItemByName = getItemByName;
exports.ITEM_DATA = ITEM_DATA;
exports.displayItemData = displayItemData;
exports.consumeItem = consumeItem;

})(window);


