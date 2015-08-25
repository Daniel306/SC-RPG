function home() {
  let itemScreen = function(idx, itemData) {
    cls();
    displayItemData(itemData);
    
    bt("Use", () => {
      GS.player.inventory.splice(idx, 1);
      cls();
      consumeItem(itemData)
        .then(anykey)
        .then(inventory);
    });

    bt("Back", inventory);
    redraw();
  };

  let inventory = function() {
    cls();
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

    t("")
    bt("Back", () => home());

    redraw();
  };

  let sleep = function() {
    cls();
    t("Sleeping...");
    let sleepFlavourText = [
      "zzzzz",
      "zZZZZzzzz",
      "\"not enough mineral\"",
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

  t("")
  bt("Back", () => menu());
  
  redraw();
};