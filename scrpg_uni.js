
let uni = gameMenu(menu, () => {
  bt("Take an Exam", () => {
    cls();
    t("Taking test");

    wasteTime(500).then(() => {
      var p = GS.player;
      t("");
      t("Test results for: ", p.name);
      t("");
      t("Micro: ", p.micro)
      t("Macro: ", p.macro)
      t("Strategy: ", p.strat)
      
      return anykey();  
    }).then(() => {
      uni();
    });
  });

  for (let x of [["micro","Micro-Control"], ["macro", "Macro-Management"], ["strat","Strategy"]] ){
    let price = GS.player[x[0]] * 10;
    bt("Study " + x[1] +" - $" + price, () => {
      takeMoney(price, function(){ 
        cls();
        GS.player[x[0]] += 1;

        moveTime(0, 1);
        t("Studying")
        wasteTime(1000).then(() => {
          t("Your studies have improved your "+ x[1] + "");
          anykey().then(() => {
            uni();
          })          
        });
      });
    })
  }
});