// random useful functions that *COULD* be abstracted and organized for future projects

var Util = {};
var U = Util;

Math.r = Math.random;

_.extend(Util, {
  toggleFullscreen: function() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  },

  capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  randomPickFromArray: function(arr, removeAfter) {
    var i = Math.floor(Math.r() * arr.length);

    var retMe = arr[i];
    if (removeAfter) {
      arr.splice(i, 1);
    }
    return retMe;
  },

  /*
     array must be in the format of
     [option, weight, option, weight ....]

     returns single option
  */
  randomPickProbList: function(arr) {
      if (arr.length == 1)
        return arr[0];

      var total = 0;
      for (var i=0; i<arr.length; i+=2)
        total += arr[i+1];

      var r = Math.r() * total;
      total = 0;
      for (var i=0; i<arr.length; i+=2) {
        total += arr[i+1];
        if (r < total)
          return arr[i];
      }
      throw "code fail";
  },

  /*
     array must be in the format of
     [option1, chance of getting option1, option2, chance of getting 2 ....]

     returns an array of options
  */
  randomPickMultipleFromProbList: function(arr, mult) {
    var ret = [];
    if (!mult) mult = 1;
    for (var i=0; i<arr.length; i+=2) {
      if (Math.r() < arr[i+1] * mult)
        ret.push(arr[i]);
    }
    return ret;
  },

  hexColorToRGB:function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  },

  shadeRGBColor: function (color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
  },

  
  // change saturation
  // k = 0 = no change. k > 0 = desaturate, k < 0, saturate a lot
  //http://samstarling.co.uk/2012/05/desaturating-colours-using-javascript/
  desaturateRGBColor: function(r, g, b, k) {
    var intensity = 0.3 * r + 0.59 * g + 0.11 * b;
    r = Math.floor(intensity * k + r * (1 - k));
    g = Math.floor(intensity * k + g * (1 - k));
    b = Math.floor(intensity * k + b * (1 - k));
    return [r, g, b];
  },

  rand: function(lo, hi) {
    return lo + Math.random() * (hi - lo);
  },
  randint: function(lo, hi) {
    return Math.floor(Util.rand(lo, hi));
  },

  noop: () => {},

  promising: () => {
    return (...args) => {
      let resolve = null;
      let promise = new Promise((_resolve,reject)=> resolve = _resolve);

      fcn(resolve, ...args);
      return promise;    
    }
  }
});