let GS = {
  playerName: "Nameless"
};

let t = UI.t;
let bt = UI.bt;
let cls = UI.cls;
let textBox = UI.textBox;
let wasteTime = UI.wasteTime;
let il = UI.il;
let yesOrNo = UI.yesOrNo;
let anykey = UI.anykey;

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
    m.redraw();
  });
}

story();
//initialize
m.mount(document.body, Renderer);