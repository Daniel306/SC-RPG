function home() {
  let itemScreen = function(idx, itemData) {
    cls();
    t(itemData.name);
    t("");
    t(itemData.desc);
    t("")

    bt("Use", () => {
      GS.player.inventory.splice(idx, 1);
      cls();
      t("You consumed " + itemData.name + ".");
      itemData.effect();
      anykey().then(inventory);
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

  cls();
  t("Welcome Home!");
  let energyPercent = Math.floor(GS.player.energy/GS.player.maxEnergy * 100);
  t(`You have ${energyPercent}% energy (${GS.player.energy}/${GS.player.maxEnergy}).`);

  bt("Inventory", inventory);
  t("")
  bt("Back", () => menu());
  
  redraw();
};

function saveScreen(){
  cls

  // First, read the saves to see if they are empty
  function saveSlot(i){
    // Can add "are you sure" later
    localStorage["GS" + i] = JSON.stringify(GS);
    t("saved in slot " + i);
    anykey().then(saveScreen);
  }
  //Choose save slot:
  for (let i = 1; i < 4; i++){
    let S = JSON.parse(localStorage["GS" + i]);
    if (S == null){
      let name = "empty slot";
    }else{
      let name = S.player.name + " - level " + S.player.level; 
    }
    bt(name, () => this.saveSlot(i))
  }


}