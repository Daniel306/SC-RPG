


function start (){
  cls()
  t("SC RPG")
  bt("New Game", () => name());

  redraw();
}

function name(){
  cls();
  t("Who are you?")
  let nameText = textBox();
  
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
  cls();
  vn(
    GS.player.name + " was an ordinatry kid",
    "Until one day...",
    GS.player.name + " discovered a game call",
    "\"Starcraft\"",
    "At that moment " + GS.player.name + " discovered his true destiny",
    GS.player.name + " swore to become the best Starcraft play in history",
  ).then(() => {
    menu();
  });
}

function menu() {
  cls();

  bt("Home", () => home());
  bt("Internet Cafe", () => cafe());
  bt("Pro Tour");
  bt("University", () => uni());
  bt("Mall", () => mall());

  redraw();
}

menu();

//initialize
m.mount(document.body, Renderer);

