(function(exports) {

let makeEquip = (statBoost) => {
  let applyEquip = (p, e, fcn) => {
    for(let ele of e) {
      if (e[ele] instanceof Array && p[ele] instanceof Array) {
        for (let i=0; i<e[ele].length; i++) {
          if (typeof e[ele] == typeof p[ele] == "number") {
            p[ele][i] = fcn(p[ele][i], e[ele][i]);
          } else {
            console.log("fail");
          }
        }
      } else if (typeof e[ele] == typeof p[ele] == "number") {
        p[ele] = fcn(p[ele], e[ele]);
      } else {
        console.log("fail");
      }
    }
  };

  return {
    apply: (p) => {
      applyEquip(p, statBoost, (a, b) => a+b)
    },
    unapply: (p) => {
      applyEquip(p, statBoost, (a, b) => a-b)
    }
  };
};

let ITEM_DATA = [
  // consumables
  {name: "tea",                    type:"c",   price: 8,  desc: "A drink for real men. gives 20 energy"      , effect: ()=>giveEnergy(20)},
  {name: "coffee",                 type:"c",   price: 20, desc: "Perfectly roasted, gives 40 energy"         , effect: ()=>giveEnergy(40)},
  {name: "red bull",               type:"c",   price: 50, desc: "Red bull gives you wins, provides 60 energy", effect: ()=>giveEnergy(60)},
  // mouse
  {name: "budget mouse",           type:"em",  price: 50, desc: "+1 Micro and +1 Macro",                       effect: makeEquip({micro:1, macro: 1})},
  {name: "high quality mouse",     type:"em",  price: 50, desc: "+2 Micro and +2 Macro",                       effect: makeEquip({micro:2, macro: 2})},
  // keyboard
  {name: "budget keyboard",        type:"ek",  price: 50, desc: "+1 Micro and +2 Macro",                       effect: makeEquip({micro:1, macro: 2})},
  {name: "high quality keyboard",  type:"ek",  price: 50, desc: "+2 Micro and +3 Macro",                       effect: makeEquip({micro:2, macro: 3})},
  // charm
  {name: "cute zergling figurine", type:"ec",  price: 50, desc: "+3 vs Zerg. \"notice me\".",                  effect: makeEquip({skills:[0,0,3]})},
  {name: "four-leaf clover",       type:"ec",  price: 50, desc: "+1 Strategy",                                 effect: makeEquip({strat: 1})},
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

const EQUIP_TYPE_MAP = {
  "ek": "left",
  "em": "right",
  "ed": "desk",
};

let equipItem = (itemData) => {
  let resolve = null;
  let promise = new Promise((resolve) => resolve = resolve);


  return promise;  
};

let unequipItem = (itemData) => {

}

exports.getItemByName = getItemByName;
exports.ITEM_DATA = ITEM_DATA;
exports.displayItemData = displayItemData;
exports.consumeItem = consumeItem;

})(window);


