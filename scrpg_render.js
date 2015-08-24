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
    disableAllInput: false,
  },

  _add: function(ele) {
    ele.visible = true;
    ele.inline = !!ele.inline;
    UI._l.push(ele);

    return ele;
  },

  // put a text
  t: function(text, c = "#00F") {
    return UI._add({
      type: "text",
      text: text,
      color: c
    });
  },

  // put a bt
  bt: function(name, func) {
    let bt = {
      type: "button",
      name: name,
      func: func,
      enableTest: () => true,
      forceEnable: false,
    };
    bt.setEnableTest = (fcn) => {bt.enableTest = fcn};
    return UI._add(bt);
  },

  // TODO: refactor to return UI._add, and add onkeydown event handler
  textBox: function(defaultText = "", placeholder = "") {
    let text = m.prop(defaultText);
    return UI._add({
      type: "textbox",
      value: text,
      placeholder
    });
  },

  // clear
  cls: function() {
    UI._l = [];
  },

  // wasteTime(millisec).then(A_function_to_call_after)
  wasteTime: function(toWaste, showDot = true) {
    let timeToWaste = toWaste;
    UI._states.disableAllInput = true;

    let finalPromiseResolve = null;
    let finalPromise = new Promise((resolve,reject)=> finalPromiseResolve = resolve);
    finalPromise.then(() => m.redraw())

    const MILISEC_PER_DOT = Math.min(toWaste, 200);
    function wasteTimeStep() {
      setTimeout(() => {
        if (showDot) {
          let dot = UI.t(".");
          dot.inline = true;
        }
        m.redraw();

        timeToWaste = Math.max(timeToWaste - MILISEC_PER_DOT, 0);
        if (timeToWaste <= 0) {
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

  getChoice: function(...choices) {
    let finalPromiseResolve = null;
    let promise = new Promise((resolve,reject) => finalPromiseResolve = resolve);

    UI._states.disableAllInput = true;

    let buttons = choices.map((c, idx) => {
      let bt =  UI.bt(c, () => {
        UI._states.disableAllInput = false;
        buttons.forEach((bt) => {
          bt.forceEnable = false;
          bt.visible = false;
        });
        finalPromiseResolve(idx);
      });
      bt.inline = true;
      bt.forceEnable = true;
      return bt;
    });

    m.redraw();
    return promise;
  },

  anykey: function() {
    var anyKeyText = UI.t("Click anywhere to continue.", "#FD8A08");
    UI._states.disableAllInput = true;

    let promise = new Promise((resolve,reject) => {
      window.onmousedown = function() {
        resolve();
        window.onmousedown = null;
        UI._states.disableAllInput = false;
        anyKeyText.visible = false;
      }
    });
    // promise.then(() => m.redraw());
    m.redraw();
    return promise;
  },

  // getter
  list: function() {return UI._l},
  states: function() {return UI._states},
};


var Renderer = {
  //controller
  controller: function() {
    return {
      list: UI.list,
    }
  },

  //view
  view: function(ctrl) {
    return m("div", [
      ctrl.list().filter((item) => {
        return item.visible;
      }).map(function(item, idx) {
        return m(item.inline ? "span":"div", [
          itemToM(item)
        ]);
      }),
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
            placeholder: item.placeholder,
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
