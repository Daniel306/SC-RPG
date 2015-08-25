function cafe() {
  let cafe = () => {
    cls();
    t("Welcome to Internet Cafe!");
    t("Would you like to get a PC for $10?");
    t("")
    
    getChoice("Yes - pay $10", "Leave").then((c) => {
      [
        () => takeMoney(10, 
          () => {t("You paid $10"); anykey().then(playGame)},
          () => anykey().then(menu)
        ),
        () => menu()
      ][c]();
    });
  };

  let playGame = () => {
    cls();
    t("You have a PC in front of you!")
    t("");

    ["Play Maple Story", "Play Counter-Strike", "Browse Internet", "Play a Random Game"].forEach((action) => {
      bt(action, () => {
        cls();
        return vn(
          "You decided to " + action,
          "It was interesting",
          "And you even enjoyed it a little",
          "Unfortunately, it did not improve any skills that mattered",
          "Eventually, you left the Internet Cafe without gaining anything"
        ).then(() => menu());
      });
    });

    bt("Play Starcraft", () => bNet());

    t("");
    bt("Leave Internet Cafe", () => menu());
    redraw();
  };

  let bNet = () => {
    cls();
    t("Connecting to Battle.Net");
    wasteTime(1000).then(() => {
      t("Searching for fastest server");
      return wasteTime(1000);  
    }).then(() => {
      t("Getting player profile");
      return wasteTime(1000);  
    }).then(() => {
      t("Logging in");
      return wasteTime(1000);  
    }).then(() => {
      serverScreen();
    })
  };

  let serverScreen = gameMenu(playGame, () => {
    t("Connected to Asia Server!");
    bt("Join a Game", () => {
      joinGame();
    });
  });

  let joinGame = gameMenu(serverScreen, () => {
    t("Available Games")
    t("");
    ["1v1 noob only", "please be a noob", "1v1 python", "5v3 crazy computer", "BGHBGHBGH", "Sunken D - pro only"].forEach((name) => {
      bt(name, () => {
        battle(name, [
          [GS.player, generatePlayer(1)],
          [generatePlayer(1), generatePlayer(1)]
        ]).then((teamThatWon) => {
          t("");
          t("Game has ended");
          anykey().then(() => {
            if (teamThatWon == 0) {
              cls();
              t("You won!");
              t("");
              let expGain = opponentToExp(generatePlayer(1));
              t("You gained " + expGain + " experience");
              let p = GS.player;
              p.exp += expGain;
              t("Total experience: " + (p.exp - expGain) + "/" + p.goalExp + " -> " + p.exp + "/" + p.goalExp);
              anykey().then(checkLevelUp).then(joinGame);
            } else {
              joinGame();  
            }            
          });
        });
      });
    });
  });;

  cafe();
};