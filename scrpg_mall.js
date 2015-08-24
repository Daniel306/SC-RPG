
function mall() {
  cls();
  t("you have ", GS.player.cash, " money")
  bt("Hardware");
  bt("Beg for money", () => {
    if (GS.player.energy < 10){
      t("too tired to go beg")
      return;
    }
  
    GS.player.energy-=10;
    wasteTime(3000).then(() => {
      let rand = Math.random()
      if (rand > 0.4){ // small gain
        t("You got $10")
        GS.player.cash += 10;
      } else if (rand > 0.25){ // huge gain, small chance
        let amount = Math.round(Math.random()*40 + 20)
        t("What luck! a SC enthusiast gives you $", amount)
        GS.player.cash += amount;
      } else if (rand > 0.15){
        t("Nothing happpens, nobody wants to give you money")
      } else {
        let amount = Math.round(Math.min(Math.random()*100, GS.player.cash));
        if (amount == GS.player.cash){
          t("You got robbed of all you had")
          t("Robbers wanted more, so they got mad and punced you")
          GS.player.energy = Math.max(GS.player.energy-10, 0);
          GS.player.cash = 0;
        } else {
          t("You got robbed of $", amount);
          t("The robbers leave happily")
          GS.player.cash -= amount;
        }
        t("You should probably use a bank");
      } // if
      anykey().then(() => {
        mall();
      }) // anykey
    }) // wasteTime
  }); // bt

  bt("Go to the bank", () => bank());
  
  t("")
  bt("Back", () => menu());

  redraw();
}

function bank(){
  cls();
  t("You have $", GS.player.cash, " on hand");
  t("  and $", GS.player.saving, " in your account")
  t("Enter how much you wish to deposit/withdraw");
  let moneyBox = textBox();

  let validMoney = function(){
    return (!isNaN(moneyBox()) && moneyBox() != "" && moneyBox > 0);
  }

  bt("Deposit", () => {
    GS.player.cash -= parseInt(moneyBox());
    GS.player.saving += parseInt(moneyBox());
    bank();
  }).setEnableTest(() => {
    return (validMoney() && moneyBox() <= GS.player.cash);
  })

  
  bt("Withdraw", ()=> {
    GS.player.cash += parseInt(moneyBox());
    GS.player.saving -= parseInt(moneyBox());
    bank();
  }).setEnableTest(() => {
    return (validMoney() && moneyBox() <= GS.player.saving)
  })
  bt("Back", () => mall());

  redraw();
}