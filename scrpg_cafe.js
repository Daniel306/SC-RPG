function cafe() {
  cls();
  t("Welcome to Internet Cafe!");
  t("")
  bt("Back", () => menu());

  redraw();
};