(function(exports){

let eventList = [];


let createEvent = function(startTime, dur, fcn){
  eventList.push({
    startTime,
    dur,
    fcn
  })
}

const START_TIME = new Date(2010, 6, 27);
const MINUTE = 60;
const HOUR = 60*MINUTE;
const DAY = 24*HOUR;


// Below are a bunch of events
//let crazy_guy = 


let createEvents = function(seed){

  createEvent(START_TIME, DAY, ()=>{
    let loss = Math.min(30, GS.player.energy);
    GS.player.energy -= loss;

    return vn("A new restaurant just opened",
      "They are giving free food to taste",
      "The food is ok ",
      "You get a stomachache",
      "You lose " + loss + " energy",
      "You decide to never pay them for food")
  });

  createEvent(START_TIME+7*DAY, DAY, ()=> {
    return vn("a random passerby shouts at you:",
              "NOOB!",
              "then walks away")
  })

  eventList.sort((a,b) => {
   return (a.startTime > b.startTime);
  })

}

// Checks if event should trigger based on current time
// Also eliminates events whose deadline passed from list.
let triggerEvent = function(){
  console.log("test")
  console.log(eventList)
  while(eventList[0].startTime + eventList[0].dur < getTime() ){
    eventList.shift(); // passed deadline
  }
  console.log(eventList[0].startTime.getTime())
  if (eventList[0].startTime <= getTime()){ // meaning it started
    return eventList[0].fcn();
  }
  return null; // no function trigger
}
exports.createEvents = createEvents;
exports.triggerEvent = triggerEvent;

})(window);