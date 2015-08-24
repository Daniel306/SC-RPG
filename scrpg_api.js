// t("test to draw", "text to draw #2"...)
let t = (...texts) => {
  ct("#008", ...texts);
};

// ct(color, "text to draw", "text to draw #2"...)
let ct = (c, ...texts) => {
  UI.t (texts.join(""), c);
};

// bt("button name", onclick function)
let bt = UI.bt;

// clear screen
let cls = UI.cls;

// read the code
let textBox = UI.textBox;

// next ui element will be inline
let il = UI.il;

/////////////////////////////////////////////////////////////
// redraw is NOT automatic 
// calling any of these functions below will trigger a redraw
/////////////////////////////////////////////////////////////

// redraws things
let redraw = m.redraw;

// wasteTime(millisecs).then(function to call after wasteime is done)
let wasteTime = UI.wasteTime;

// getChoice("choice 1", "choice 2")
//   .then(function(index of choice) {you write this})
let getChoice = UI.getChoice;

// yesOrNo()
//   .then(function(0 for yes, 1 for no) {you write this})
let yesOrNo = () => UI.getChoice("Yes", "No");

// anyKey().then(function() {you write this})
let anykey = UI.anykey;

// visual novel style display of text
// vn("text 1", "text2", "text3").then(_your_function_)
let vn = (...texts) => {
  let promiseResolve = null;
  let promise = new Promise((resolve) => promiseResolve = resolve);

  let curTextIdx = 0;

  let printSingleText = () => {
    if (curTextIdx < texts.length) {
      t(texts[curTextIdx++]);
      anykey().then(printSingleText);
    } else {
      promiseResolve();
    }
  };
  printSingleText();
  return promise;
};