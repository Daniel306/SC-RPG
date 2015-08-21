
function mall() {
  cls();

  bt("Hardware");
  bt("Beg for money", () => {
    wasteTime(3000).then(() => {
      t("you got 10$")
    })
  });
  
  t("")
  bt("Back", () => menu());
}
