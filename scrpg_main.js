


function start (){
  cls()
  t("SC RPG")
  bt("New Game", () => name()).setEnableTest(() => true);
}

function name(){
  cls();
  t("Who are you?")
  let nameText = textBox();
  
  bt("Ok", () => {
    GS.playerName = nameText();
    story()
  }).setEnableTest(() => {
    console.log("foo");
    return nameText().length > 0;
  })

  bt("back", () => start())
}

function story(){
  cls();

  anykey().then(() => {
    return anykey();
  }).then(() => {
    return anykey();
  }).then(() => {
    t("done");
  });
}

function menu() {
  cls();

  bt("Home", () => home());
  bt("Internet Cafe", () => cafe());
  bt("Pro Tour");
  bt("University", () => uni());
  bt("Mall", () => mall());


  let gameTest = () => {
    battle("Lost Temple", [
      [generatePlayer(1), generatePlayer(1)], 
      [generatePlayer(1), generatePlayer(1)]
    ]).then((teamThatWon) => {
      return wasteTime(1000)
    }).then(() => menu())
  }
  bt("Test Battle", gameTest)
}

menu();
//initialize
m.mount(document.body, Renderer);