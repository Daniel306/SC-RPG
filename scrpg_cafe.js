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

    let diffs = [
      "noob only",
      "beginner",
      "average",
      "any",
      "no noobs",
      "expert",
      "pro only"
    ];

    let format = [
      ["1v1",1],
      ["1 on 1",1],
      ["2v2",2],
      ["2 vs 2",2],
      ["3v3",3],
      ["", 1],
      ["", 2],
      ["", 3],
      ["", 4]
    ];

    let mapNames = [
      "Python",
      "Ruby",
      "BGHBGHBHG",
      "FASTEST",
      "fastest",
      "Lost temple",
      "JOINJOIN"
    ];

    let gameCount = U.randint(5, 10);
    let games = [];
    for (var i=0; i<gameCount; i++) {
      let d = U.randint(0, diffs.length - 1);
      let f = Util.randomPickFromArray(format);
      let m = Util.randomPickFromArray(mapNames);

      games.push({
        diff: d,
        count: f[1],
        name: m + " " + f[0] + " " + diffs[d]
      });
    }

    games.forEach((gameData) => {
      bt(gameData.name, () => {
        let team1 = [], team2 = [];
        for (let i = 0; i < gameData.count; i++) {
          team1.push(generatePlayer(3 + (gameData.diff) * 8));
          team2.push(generatePlayer(3 + (gameData.diff) * 8));
        }

        team1[0] = GS.player;

        battle(name, [
          team1,
          team2
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