function start (){
  cls()
  t("SC RPG")
  bt("New Game", () => name());
  bt("Load Game");
  t("");
  bt("Credits");

  redraw();
}

function name(){
  cls();
  t("Who are you?")
  let nameText = textBox("", "type name here").value;
  
  bt("Ok", () => {
    GS.player.name = nameText();
    story()
  }).setEnableTest(() => {
    return nameText().length > 0;
  })

  bt("back", () => start())

  redraw();
}

function story(){
  let race = ["Terran", "Protoss", "Zerg"];


  cls();
  vn(
    GS.player.name + " was an ordinatry kid",
    "Until one day...",
    GS.player.name + " discovered a game called",
    "\"Starcraft\"",
    "At that moment " + GS.player.name + " discovered his true destiny",
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
  }).then(() => wasteTime(1000)).then({
    t("");
    t("And so the journey begins");
    anykey().then(menu);
  });
}

function menu() {
  cls();
  t("Welcome to Seoul");
  t("It is " + getTime().toLocaleString());
  t("");
  t("Where would you like to go?");
  t("");

  bt("Home", () => home());
  bt("Internet Cafe", () => cafe());
  bt("Pro Tour");
  bt("University", () => uni());
  bt("Mall", () => mall());
  bt("Fate Zero Prologue", () => fate());

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
}

menu();
m.mount(document.body, Renderer);

