// the functiosn we are going to call

// t("test to draw", optional color)
let t = (...texts) => {
  UI.t (texts.reduce(((sofar, t) => sofar + t), ""));
};

// bt("button name", onclick function)
let bt = UI.bt;

// clear screen
let cls = UI.cls;

// read doc
let textBox = UI.textBox;

// wasteTime(millisecs).then(function to call after wasteime is done)
let wasteTime = UI.wasteTime;

// next ui element will be inline
let il = UI.il;

// yesOrNo().then(function(response) {you write this})
let yesOrNo = UI.yesOrNo;

// anyKey().then(function() {you write this})
let anykey = UI.anykey;
