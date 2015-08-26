let mall = gameMenu(menu, () => {
  t("You have $", GS.player.cash)
  t("");
  bt("Browse for Hardware", hardware);
  bt("Visit a Food Shop", foodShop);
  bt("Beg for Money", beg);
  bt("Go to the Bank", bank);
});

function makeSellItemScreen (backTo, itemData) {
  return gameMenu(backTo, () => {
    displayItemData(itemData);
    bt("Buy for $" + itemData.price, () => takeMoney(itemData.price, () => {
      cls();
      t("You purchased " + itemData.name);
      anykey().then(backTo);
      GS.player.inventory.push(itemData.name);
    }));

    if (itemData.type == "c") {
      bt("Buy for $" + itemData.price + " and Consume Immediately", () => takeMoney(itemData.price, () => {
        cls();
        t("You purchased " + itemData.name + ".");
        consumeItem(itemData)
          .then(anykey)
          .then(backTo);
      }));
    }
  });
};

let hardware = gameMenu(mall, () => {
  t("Welcome our shop! Can in interest you in some hardware?");
  t("");

  ["budget mouse", "high quality mouse", "budget keyboard", "high quality keyboard", "cute zergling figurine"].forEach((name)=> {
    let itemData = getItemByName(name);
    let itemBt = bt(name, makeSellItemScreen(hardware, itemData));
    itemBt.inline = true;
  });
});

let foodShop = gameMenu(mall, () => {
  t("Please come in! What would you like to buy?");
  t("");

  ["tea", "coffee", "red bull"].forEach((name)=> {
    let itemData = getItemByName(name);
    let itemBt = bt(name, makeSellItemScreen(foodShop, itemData));
    itemBt.inline = true;
  });
});

let bank = gameMenu(mall, () => {
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
});

let beg = gameMenu(mall, () => {
  let bitOfMoney = function(){
    let amount = Util.randint(5, 10);
    GS.player.cash += amount;
    return vn("A kind person gives you $" + amount + " for food",
      "but it's obviously going to be spent on starcraft");
  }

  let lotsOfMoney = function(){
    let amount = Util.randint(30, 50);
    GS.player.cash += amount;
    return vn("A rich person gives you $" + amount + " for groceries",
      "but it's obviously going to be spent on starcraft");
  }

  let bitOfFood = function(){
    let gain = giveEnergy(20);
    return vn("A kind person gives you a sandwich",
        "It is delicious",
        "You recover " + gain + " energy");
  }

  let SCFan = function() {
    let amount =  Util.randint(5, 10);
    GS.player.cash += amount;
    return vn("A kind starcraft fan takes you up on the offer",
       "after playing starcraft for him, he gives you a red bull and $" 
        + amount);
  }

  let SCHater = function(){
    takeEnergy(Math.min(GS.player.energy, 20), (loss) => {
      return vn("An evil starcraft hater calls you a noob",
        "tells you to play Call of Duty instead",
        "Then kicks you",
        "It hurts",
        "You lose " + loss + " energy");      
    })
  }

  let useSign = function(List){
    takeEnergy(10, () => {
      cls();
      t("Begging for money");
      return wasteTime(1000).then(Util.randomPickProbList(List)).then(beg);
    }, () => {
      t("You are too tired to beg")
      return anykey().then(beg);
    });
  }

  t("Choose your begging sign");
  bt("\"I hunger, Please food\"",  
      () => useSign([bitOfMoney, 2, bitOfFood, 3, lotsOfMoney, 1]));

  bt("\"Will play SC for food\"", 
    () => useSign([bitOfMoney, 2, bitOfFood, 2, SCFan, 3, SCHater, 3]));
});