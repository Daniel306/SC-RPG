(function(exports){

let eventList;

let idNum;
 

let createEvent = function(startTime, dur, fcn){
  eventList.push({
    startTime,
    dur,
    id : idNum++,
    fcn
  })
}

/*
let runEvent = function(e){
  GS.usedEventIds.push(e.id);
  e.fcn();
}
*/
/*
let clearCompletedEvents = function(){
  eventList = eventList.filter((e) => {
    return GS.usedEventIds.indexOf (e.id) < 0;
  })
}
*/

const START_TIME = new Date(2010, 6, 27);
const MINUTE = 60;
const HOUR = 60*MINUTE;
const DAY = 24*HOUR;

// Below are a bunch of events
//let crazy_guy = 


let createEvents = function(seed) {
  Math.seed("" + seed);
  idNum = 0;
  eventList = [];
  createEvent(START_TIME, DAY, ((moneyGet) => () => {
    GS.player.cash += moneyGet;
    return vn("You found $" + moneyGet);
  }) (Math.floor(Math.r() * 5)));


  createEvent(START_TIME, DAY, ()=>{
    /*
    let loss = Math.min(30, GS.player.energy);
    GS.player.energy -= loss;

    return vn("A new restaurant just opened",
      "They are giving free food to taste",
      "The food is ok ",
      "You get a stomachache",
      "You lose " + loss + " energy",
      "You decide to never pay them for food")
*/
    return vn("A new restaurant just opened",
      "They are giving free food to taste",
      "Do you want to eat?").then(yesOrNo).then((no) => {
        if(no){
          return vn("You reject the free food",
            "What's wrong with you?");
        }else{
          if (seed % 2 >= 1){ // good event
            let gain = giveEnergy(20);
            return vn("It was delicious",
              "You recover " + gain + " energy",
            "But seeing the price you decide to never pay for it");
          } else {
            let loss = Math.min(30, GS.player.energy);
            GS.player.energy -= loss;
            return vn("The food is ok ",
              "You get a stomachache",
              "You lose " + loss + " energy",
              "You decide to never pay them for food")
          }
        } 
      })
  });

  createEvent(new Date(START_TIME.getTime()+7*DAY*1000), DAY, ()=> {
    return vn("a random passerby shouts at you:",
      "NOOB!",
      "then walks away")
  })

  eventList.sort((a,b) => {
    return a.startTime - b.startTime;
  })
}

// Checks if event should trigger based on current time
// Also eliminates events whose deadline passed from list.
let triggerEvent = () => new Promise((resolve) => {
  while(eventList.length && ((eventList[0].startTime + eventList[0].dur < getGameTime())
        || GS.usedEventIds.indexOf (eventList[0].id) >= 0)){
    eventList.shift(); 
  }

  if (eventList.length && eventList[0].startTime <= getGameTime()) {
    cls();
    GS.usedEventIds.push(eventList[0].id);
    eventList[0].fcn().then(resolve);
  } else {
    resolve();
  }
});

exports.createEvents = createEvents;
exports.triggerEvent = triggerEvent;

})(window);