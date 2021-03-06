function start() {
  cls()
  t("SC RPG")
  bt("New Game", getPlayerName);
  bt("Load Game", loadScreen);
  t("");
  bt("Credits");

  redraw();
}

let getPlayerName = gameMenu(start, () => {
  t("Who are you?")
  let nameText = textBox("", "type name here").value;
  
  bt("Ok", () => {
    GS.player.name = nameText();
    story()
  }).setEnableTest(() => {
    return nameText().length > 0;
  })
});

function story(){
  cls();

  let race = ["Terran", "Protoss", "Zerg"];
  vn(
    GS.player.name + " was an ordinatry kid",
    "Until one day...",
    GS.player.name + " discovered a game called",
    "\"Starcraft\"",
    "At that moment " + GS.player.name + " discovered their true destiny",
    GS.player.name + " swore to become the best Starcraft player in history"
  ).then(() => {
    cls();
    t("Choose your race! You cannot change this later.");
    t("");
    return getChoice(...race);
  }).then((c) => {
    cls();
    GS.player.race = ["t", "p", "z"][c];
    return vn(
      GS.player.name + " decided to be a " + race[c] + " player!",
      "After selling everything, " + GS.player.name + " travels to Seoul",
      "The captital of Korea, and the home of the best Starcraft players"
    )
  }).then(() => wasteTime(1000)).then(() => {
    t("");
    t("And so the journey begins");
    anykey().then(menu);
  });
}

function menu() {
   triggerEvent().then(() => {
    cls();
    createEvents(5);
    t("It is " + getGameTime().toLocaleString());
    t("");
    t("Where would you like to go?");
    t("");

    bt("Home", home);
    bt("Internet Cafe", cafe);
    bt("Tournament", tournament);
    bt("University", uni);
    bt("Mall", mall);

    t("");

    bt("Return to Main Menu", () => {
      cls();
      t("Are you sure?")
      t("Any unsaved progress will be lost");
      getChoice("Yes, Quit", "Go Back").then((c) => [
        start,
        menu
      ][c]());
    });

    redraw();    
  });
}

let loadScreen = gameMenu(start, () => {
  function loadSlot(i){
    if (localStorage["GS" + i] == undefined) {
      cls();
      t("empty slot, nothing to load");
      anykey().then(loadScreen);
    } else {
      GS = JSON.parse(localStorage["GS" + i]);
      createEvents(GS.seed);

      cls();
      t("loaded succesfully")
      anykey().then(menu);
    }  
  }

  t("Choose save slot to load:")
  for (let i = 1; i < 4; i++){
    let name = "Slot " + i + ": empty slot"
    if (localStorage["GS" + i] != undefined){
      let S = JSON.parse(localStorage["GS" + i]);
      name = "Slot " + i + ": " + S.player.name 
              + " - level " + S.player.level; 
    }
    bt(name, ()=>loadSlot(i));
  }
});

newGame();

start();

m.mount(document.body, Renderer);

