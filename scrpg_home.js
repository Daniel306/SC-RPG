let home = gameMenu(menu, () => {
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
    };

    t("");
    [["left", "Left Hand"], ["right", "Right Hand"], ["desk", "On the Desk"]].forEach((slot) => {
      let itemName = GS.player.equip[slot[0]];
      let slotName = slot[1];

      if (itemName) {
        let itemData = getItemByName(itemName);
        let text = t(slotName + ": " + itemData.name);
        let unequipBt = bt("Unequip", () => {
          unequipItem(slot[0]);
          inventory();
        });
      }
    });
  });
  
  let itemScreen = gameMenu(inventory, (idx, itemData) => {
    displayItemData(itemData);
    
    if (itemData.type == "c") {
      bt("Consume", () => {
        GS.player.inventory.splice(idx, 1);
        cls();
        consumeItem(itemData)
          .then(anykey)
          .then(inventory);
      });
    } else if (itemData.type.substr(0, 1) == "e") {
      bt("Equip", () => {
        GS.player.inventory.splice(idx, 1);
        equipItem(itemData.name);
        cls();
        t("You have equipped " + itemData.name);
        anykey().then(inventory);
      });
    } else {
      console.log("fail");
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
      GS.player.energy = GS.player.maxEnergy;

      moveTime(0, 8, 0);
      return anykey();
    }).then(home);
  };

  cls();
  t("Welcome Home!");
  let energyPercent = Math.floor(GS.player.energy/GS.player.maxEnergy * 100);
  t(`You have ${energyPercent}% energy (${Math.floor(GS.player.energy)}/${GS.player.maxEnergy}).`);

  bt("Inventory", inventory);
  bt("Sleep", sleep);
  bt("Light Switch", () => UI.globalClass() == "day" ? UI.globalClass("night") : UI.globalClass("day"))
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
