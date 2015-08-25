
function mall() {
  cls();
  t("you have $", GS.player.cash)
  bt("Hardware");
  bt("Beg for money", () => beg());
  bt("Go to the bank", () => bank());
  
  t("")
  bt("Back", () => menu());

  redraw();
}

function bank(){
  cls();
  t("You have $", GS.player.cash, " on hand");
  t("You have $", GS.player.saving, " in your account")
  let moneyBox = textBox().value;

  let validMoney = function() {
    return (!isNaN(moneyBox()) && moneyBox() != "" && moneyBox() > 0);
  }

  let deposit = bt("Deposit", () => {
    GS.player.cash -= parseInt(moneyBox());
    GS.player.saving += parseInt(moneyBox());
    bank();
  })
  deposit.setEnableTest(() => {
    return (validMoney() && moneyBox() <= GS.player.cash);
  })
  deposit.inline = true;

  let withdraw = bt("Withdraw", ()=> {
    GS.player.cash += parseInt(moneyBox());
    GS.player.saving -= parseInt(moneyBox());
    bank();
  })
  withdraw.setEnableTest(() => {
    return (validMoney() && moneyBox() <= GS.player.saving)
  })
  withdraw.inline = true;

  t("");
  bt("Back", () => mall());

  redraw();
}

function beg(){
  cls();
  
  let bitOfMoney = function(){
    let amount = Util.randint(5, 10);
    GS.player.cash += amount;
    return vn("A kind person gives you $" + amount + " for food",
      "but it's obviously going to be spent on starcraft");
  }

  let lotsOfMoney = function(){
    let amount = Util.randint(30, 50);
    GS.player.cash += amount;
    vn("A rich person gives you $" + amount + " for groceries",
      "but it's obviously going to be spent on starcraft");
  }

  let bitOfFood = function(){
    let gain = Math.min(GS.player.maxEnergy - GS.player.energy, 20);
    GS.player.energy += gain;
    return vn("A kind person gives you a sandwich",
        "It is delicious",
        "You recover " + gain + " energy");
  }

  let SCFan = function(){
    let amount =  Util.randint(5, 10);
    GS.player.cash += amount;
    return vn("A kind starcraft fan takes you up on the offer",
       "after playing starcraft for him, he gives you a red bull and $" 
        + amount);
  }

  let SCHater = function(){
     let loss = Math.min(GS.player.energy, 20);
     GS.player.energy = GS.player.energy - loss;
     return vn("An evil starcraft hater calls you a noob",
       "tells you to play Call of Duty instead",
       "Then kicks you",
       "It hurts",
       "You lose " + loss + " energy");
  }

  let useSign = function(List){
    if (GS.player.energy < 10){
      t("You are too tired to beg")
      anykey().then(beg);
    }else{
      GS.player.energy -= 10;
      cls();
      wasteTime(500).then(Util.randomPickProbList(List)).then(beg);
    }
  }

  t("Choose your sign");
  bt("I hunger, Please food",  
      () => useSign([bitOfMoney, 2, bitOfFood, 3, lotsOfMoney, 1]));

  bt("Will play SC for food", 
      () => useSign([bitOfMoney, 2, bitOfFood, 2,  
                      SCFan, 3, SCHater, 3]));

  t("");
  bt("Back", () => mall());
  
  redraw();
}