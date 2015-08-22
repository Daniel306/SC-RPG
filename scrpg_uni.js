
function uni() {
  cls();

  bt("Take an Exam", () => {
    cls();
    t("Taking test");

    wasteTime(500).then(() => {
      var p = GS.player;
      t("");
      t("Test results for: ", p.name);
      t("Micro: ", p.micro)
      t("Macro: ", p.macro)
      t("Strategy: ", p.strat)

      t("Skill vs Terran: ", p.skills["t"]);
      t("Skill vs Protoss: ", p.skills["p"]);
      t("Skill vs Zerg: ", p.skills["z"]);

      return anykey();  
    }).then(() => {
      uni();
    });
  });


  for (let x of [["t","Terran"],["p","Protoss"],["z", "Zerg"]]){
    bt("Study " + x[1] +" Build Order - $1", () => {
      console.log(x);
      payFor(1, function(){ 
        cls();
        GS.player.skills[x[0]] += 1; 
        t("+ 1 Skill vs "+ x[1]);
        anykey().then(() => {
          uni();
        })
      });
    })
  }
  
  for (let x of [["micro","micro-control"], ["macro", "macro-management"], ["strat","strategy"]] ){
    bt("Study " + x[1] +" - $2", () => {
      payFor(2, function(){ 
        cls();
        GS.player[x[0]] += 1; 
        t("Your studies have improved your "+ x[1] + "");
        anykey().then(() => {
          uni();
        })
      });
    })
  }


  t("");
  bt("Back", () => menu());
}