let GS = {
  playerName: ""
};

let p = UI.t;
let bt = UI.bt;
let cls = UI.cls;
let textBox = UI.textBox;
let wasteTime = UI.wasteTime;
let il = UI.il;

function start (){
  cls()
  p("SC RPG")
  bt("New Game", () => name()).setEnableTest(() => true);
}

function name(){
  cls();
  p("Who are you?")
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
  
  wasteTime(1000).then(() => {
    p("Hello " + GS.playerName);
  });
}

start();
//initialize
m.mount(document.body, Renderer);