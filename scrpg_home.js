function home() {       
  cls();
  t("Welcome Home!");

  t("")
  bt("Back", () => menu());
  
  redraw();
};