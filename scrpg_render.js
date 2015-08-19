/*
let foo = "hello";
console.log(foo);
*/
//model
var UI = {
  // private
  l: [],

  // put a text
  t: function(text, c = "#00F") {
    UI.l.push({
      type: "text",
      text: text,
      color: c
    });
  },
    
  // put a bt
  bt: function(name, func, c = "#000") {
    UI.l.push({
      type: "button",
      name: name,
      func: func,
      color: c
    })
  },

  textBox: function(defaultText = "") {
    var text = m.prop(defaultText);
    UI.l.push({
      type: "textbox",
      value: text,
    });
    return text;
  },

  // clear
  cls: function() {
    UI.l = [];
  },

  list: function() {
    return UI.l;
  }
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
        return m("div", [
          itemToM(item)
        ]);
      }),
      // m("button", {onclick: ctrl.rotate}, "Rotate links")
    ]);

    function itemToM (item) {
      let toCall = {
        "text": (item) => {
          return m("span", {style: "color: " + item.color}, item.text)
        },
        "button":  (item) => {
          return m("button", {onclick: item.func, style: "color: " + item.color},  item.name)
        },
        "textbox": (item) => {
          return m("input", {
              type: "text",
              onchange: m.withAttr("value", item.value),
              value: item.value()
          });
        }
      }[item.type];

      return toCall(item);
    };
  }
};
