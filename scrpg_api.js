// the functiosn we are going to call

// ct(color, "text to draw, text to draw #2")
let ct = (c, ...texts) => {
  UI.t (texts.reduce(((sofar, t) => sofar + t), ""), c);
}

// t("test to draw", "text to draw #2".... etc)
let t = (...texts) => {
  ct("#008", ...texts);
};

// bt("button name", onclick function)
let bt = UI.bt;

// clear screen
let cls = UI.cls;

// read the code
let textBox = UI.textBox;

// next ui element will be inline
let il = UI.il;

///////////////////////////////////////////////////////////
// these functions below  will cause things to get redrawn

// redraws things
let redraw = m.redraw;

// wasteTime(millisecs).then(function to call after wasteime is done)
let wasteTime = UI.wasteTime;

// yesOrNo().then(function(response) {you write this})
let yesOrNo = UI.yesOrNo;

// anyKey().then(function() {you write this})
let anykey = UI.anykey;
