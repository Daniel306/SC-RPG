/*
let foo = "hello";
console.log(foo);
*/
//model

var noop = () => {};

var UI = {
  // private
  _l: [],
  _states: {
    timeToWaste: 0,
    nextOneSameLine: false,
    disableAllInput: false,
  },

  _add: function(ele) {
    ele.isInline = UI._states.nextOneSameLine;
    UI._states.nextOneSameLine = false;
    UI._l.push(ele);

    // hacky
    m.redraw();
    return ele;
  },

  il: function() {
    UI._states.nextOneSameLine = true;
  },

  // put a text
  t: function(text, c = "#00F") {
    UI._add({
      type: "text",
      text: text,
      color: c
    });
  },
    
  // put a bt
  bt: function(name, func /* , c = "#000" */) {
    let bt = {
      type: "button",
      name: name,
      func: func,
      // color: c,
      enableTest: () => true,
      forceEnable: false,
    };
    bt.setEnableTest = (fcn) => {bt.enableTest = fcn};
    return UI._add(bt);
  },

  textBox: function(defaultText = "") {
    let text = m.prop(defaultText);
    UI._add({
      type: "textbox",
      value: text,
    });
    return text;
  },

  // clear
  cls: function() {
    UI._l = [];
  },

  // wasteTime(millisec).then(A_function_to_call_after)
  wasteTime: function(toWaste) {
    if (UI._states.timeToWaste) {
      console.log("already wasting time");
      return new Promise(noop);
    }

    UI._states.timeToWaste += toWaste;
    UI._states.disableAllInput = true;
    let finalPromiseResolve = null;
    let finalPromise = new Promise((resolve,reject)=> finalPromiseResolve = resolve);
    finalPromise.then(() => m.redraw())

    const MILISEC_PER_DOT = 200;
    function wasteTimeStep() {
      setTimeout(() => {
        UI.il();
        UI.t(".");
        m.redraw();

        UI._states.timeToWaste = Math.max(UI._states.timeToWaste - MILISEC_PER_DOT, 0);
        if (UI._states.timeToWaste <= 0) {
          finalPromiseResolve();
          UI._states.disableAllInput = false;
        } else {
          wasteTimeStep();
        }
        
      }, MILISEC_PER_DOT);
    };

    wasteTimeStep();
    return finalPromise;
  },

  // yesOrNo.then((trueForYes) => {/*stuff*/})
  yesOrNo: function() {
    let finalPromiseResolve = null;
    let promise = new Promise((resolve,reject) => finalPromiseResolve = resolve);

    UI._states.disableAllInput = true;
    UI.il();
    let yesBt = UI.bt("Yes", () => {
      UI._states.disableAllInput = false;
      yesBt.forceEnable = noBt.forceEnable = false;
      finalPromiseResolve(true);
    });

    UI.il();
    let noBt = UI.bt("No", () => {
      UI._states.disableAllInput = false;
      yesBt.forceEnable = noBt.forceEnable = false;
      finalPromiseResolve(false);
    });

    yesBt.forceEnable = noBt.forceEnable = true;
    promise.then(() => m.redraw());

    return promise;
  },

  anykey: function() {
    UI.t("Click anywhere to continue.");
    m.redraw();
    let promise = new Promise((resolve,reject) => {
      window.onmousedown = function() {
        resolve();
        window.onmousedown = null;
      }
    });
    promise.then(() => m.redraw());

    return promise;
  },

  // getter
  list: function() {return UI._l},
  states: function() {return UI._states},
};


var Renderer = {
  //controller
  controller: function() {
    var list = UI.list;
    return {
      list: list,
    }
  },

  //view
  view: function(ctrl) {
    return m("div", [
      ctrl.list().map(function(item, idx) {
        return m(item.isInline ? "span":"div", [
          itemToM(item)
        ]);
      }),
      // m("button", {onclick: ctrl.rotate}, "Rotate links")
    ]);

    function itemToM (item) {
      let toCall = {
        "text": (item) => {
          return m("span", {style: "color: " + item.color + "; display: inline-block"}, item.text)
        },
        "button":  (item) => {
          return m("button", {
            onclick: item.func,
            // style: "color:" + item.color,
            disabled: (UI.states().disableAllInput || !item.enableTest()) && !item.forceEnable,
          },  item.name)
        },
        "textbox": (item) => {
          return m("input", {
            type: "text",
            oninput: m.withAttr("value", item.value),
            value: item.value(),
            disabled: UI.states().disableAllInput,
          });
        }
      }[item.type];

      return toCall(item);
    };
  }
};
