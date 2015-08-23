function cafe() {
  let cafe = () => {
    cls();
    t("Welcome to Internet Cafe!");
    t("Would you like to get a PC for $10?");
    
    getChoice("Yes - pay $10", "Leave").then((c) => {
      if (c == 1) {
        return menu();
      }
      playGame();
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
    ["1v1 noob only", "please be a noob", "1v1 python"].forEach((name) => {
      bt(name, () => {
        battle("Lost Temple", [
          [GS.player, generatePlayer(1)], 
          [generatePlayer(1), generatePlayer(1)]
        ]).then((teamThatWon) => {
          t("");
          t("Game has ended");
          return anykey();
        }).then(() => joinGame());
      });
    });

    bt("Back", () => serverScreen());
    redraw();
  };

  cafe();
};