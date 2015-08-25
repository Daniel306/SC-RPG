let home = gameMenu(menu, () => {
  let itemScreen = gameMenu(inventory, (idx, itemData) => {
    displayItemData(itemData);
    
    bt("Use", () => {
      GS.player.inventory.splice(idx, 1);
      cls();
      consumeItem(itemData)
        .then(anykey)
        .then(inventory);
    });
  });

  let inventory = gameMenu(home, () => {
    t("Inventory");

    GS.player.inventory.forEach((itemName, idx) => {
      let itemData = getItemByName(itemName);
      if (!itemData) return;

      let itemBt = bt(itemName, () => itemScreen(idx, itemData));
      itemBt.inline = true;
    });
    
    if (GS.player.inventory.length == 0) {
      t("You have nothing in your inventory");
    }
  });

  let sleep = function() {
    cls();
    t("Sleeping...");
    let sleepFlavourText = [
      "zzzzz",
      "zZZZZzzzz",
      "\"not enough minerals\"",
      "omg zerg rush!",
      "you must construct additional pylons",
      "* nuclear launch detected *",
      "omg cannon rush T_T",
      "\"not enough energy!\"",
    ];

    wasteTime(3000).then(()=>{
      t("Sleeping...");
      return wasteTime(3000)
    }).then(() => {
      t(Util.randomPickFromArray(sleepFlavourText));
      return wasteTime(3000)
    }).then(()=> {
      t("Sleeping...");
      return wasteTime(3000)
    }).then(()=> {
      t("");
      t("You woke up! Energy fully restored");
      return anykey()
    }).then(home);
  };

  cls();
  t("Welcome Home!");
  let energyPercent = Math.floor(GS.player.energy/GS.player.maxEnergy * 100);
  t(`You have ${energyPercent}% energy (${GS.player.energy}/${GS.player.maxEnergy}).`);

  bt("Inventory", inventory);
  bt("Sleep", sleep);
  bt("Save", saveScreen);
});

let saveScreen = gameMenu(home, () => {
  function saveSlot(i){
    if (localStorage["GS" + i] != undefined){
      t("Are you sure? Save slot " + i + " has a save already")
      yesOrNo().then((no) => {
        if (no) {
          saveScreen();
        }else{
          localStorage["GS" + i] = JSON.stringify(GS);
          saveScreen();
        }
      })
    } else {
      localStorage["GS" + i] = JSON.stringify(GS);
      t("saved in slot " + i);
      anykey().then(saveScreen);
    }
  }

  t("Choose a save slot:")
  for (let i = 1; i <  4; i++) {
    let name = "Slot " + i + ": empty slot"
    if (localStorage["GS" + i] != undefined){
      let S = JSON.parse(localStorage["GS" + i]);
      name = "Slot " + i + ": " + S.player.name 
              + " - level " + S.player.level; 
    }
    bt(name, () => saveSlot(i));
  }
});
