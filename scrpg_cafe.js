function cafe() {
  let cafe = () => {
    cls();
    t("Welcome to Internet Cafe!");
    t("Would you like to get a PC for $10?");
    
    getChoice("Yes - pay $10", "Leave").then((c) => {
      [
        () => payFor(10, playGame, menu),
        () => menu()
      ][c]();
    });
  };

  let playGame = () => {
    cls();
    t("Which game would you like to play?")
    bt("Starcraft", () => bNet());

    ["Maple Story", "Counter-Strike"].forEach((game) => {
      bt(game, () => {
        cls();
        return vn(
          "What's wrong with you?",
          "Why would you want to play " + game + "?",
          "You've been kicked out of the Internet Cafe"
        ).then(() => menu());
      });
    });

    t("");
    bt("Leave", () => menu());
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

  let serverScreen = () => {
    cls();
    t("Connected to Asia Server!");
    bt("Join a Game", () => {
      joinGame();
    });

    t("");
    bt("Back", () => playGame());
    redraw();
  };

  let joinGame = () => {
    cls();
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

    t("");
    bt("Back", () => serverScreen());
    redraw();
  };

  cafe();
};