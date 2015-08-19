let GS = {
  playerName: ""
};

let p = UI.t;
let bt = UI.bt;
let cls = UI.cls;
let textBox = UI.textBox;

function start (){
  cls()
  p("SC RPG")
  bt("New Game", () => name())
}

function name(){
  cls();
  p("Who are you?")
  let nameText = textBox();
  bt("Ok", () => {
    GS.playerName = nameText();
    story()
  })
  bt("back", () => start())
}

function story(){
  cls();
  p("Hello " + GS.playerName);
}

start();
//initialize
m.mount(document.body, Renderer);