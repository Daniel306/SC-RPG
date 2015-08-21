
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

  bt("Study - Terran Build Order", () => {
    cls();
    
    GS.player.skills["t"] += 1; 
    t("+ 1 Skill vs Terrain");
    anykey().then(() => {
      uni();
    });
  });

  t("");
  bt("Back", () => menu());
}