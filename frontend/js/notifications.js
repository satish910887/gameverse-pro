/* ==========================================================
   GameVerse Pro
   Production Notification System
   Part 1 / 4
========================================================== */

class NotificationManager{

constructor(){

this.container=null;

this.queue=[];

this.active=0;

this.maxVisible=4;

this.defaultDuration=3500;

this.init();

}

/* ======================================
   INIT
====================================== */

init(){

this.container=document.createElement("div");

this.container.id="notificationContainer";

this.container.className="notify-top-right";

document.body.appendChild(this.container);

}

/* ======================================
   SHOW
====================================== */

show(message,type="success",duration=this.defaultDuration){

this.queue.push({

message,

type,

duration

});

this.processQueue();

}

/* ======================================
   PROCESS QUEUE
====================================== */

processQueue(){

while(

this.active<this.maxVisible &&

this.queue.length>0

){

const item=this.queue.shift();

this.create(item);

}

}

/* ======================================
   ICON
====================================== */

getIcon(type){

switch(type){

case "success":

return "✅";

case "error":

return "❌";

case "warning":

return "⚠️";

case "info":

return "ℹ️";

default:

return "🔔";

}

}
  /* ==========================================================
   GameVerse Pro
   Production Notification System
   Part 2 / 4
========================================================== */

/* ======================================
   CREATE NOTIFICATION
====================================== */

create(item){

this.active++;

const toast=document.createElement("div");

toast.className=`notification ${item.type}`;

toast.innerHTML=`

<div class="notify-content">

<span class="notify-icon">

${this.getIcon(item.type)}

</span>

<div class="notify-message">

${item.message}

</div>

<button class="notify-close">

✖

</button>

</div>

<div class="notify-progress"></div>

`;

this.container.appendChild(toast);

requestAnimationFrame(()=>{

toast.classList.add("show");

});

const progress=

toast.querySelector(

".notify-progress"

);

progress.style.animation=

`notifyProgress ${item.duration}ms linear forwards`;

const timer=setTimeout(()=>{

this.remove(toast);

},item.duration);

toast.querySelector(

".notify-close"

).addEventListener(

"click",

()=>{

clearTimeout(timer);

this.remove(toast);

}

);

if(

typeof playNotificationSound==="function"

){

playNotificationSound();

}

}

/* ======================================
   REMOVE
====================================== */

remove(toast){

if(!toast)return;

toast.classList.remove("show");

toast.classList.add("hide");

setTimeout(()=>{

toast.remove();

this.active--;

this.processQueue();

},300);

}

/* ======================================
   CLEAR ALL
====================================== */

clear(){

this.queue=[];

this.container.innerHTML="";

this.active=0;

  }
  /* ==========================================================
   GameVerse Pro
   Production Notification System
   Part 3 / 4
========================================================== */

/* ======================================
   POSITION
====================================== */

setPosition(position){

const positions=[

"top-right",
"top-left",
"bottom-right",
"bottom-left",
"top-center",
"bottom-center"

];

if(!positions.includes(position)){

position="top-right";

}

this.container.className=

`notify-${position}`;

localStorage.setItem(

"notifyPosition",

position

);

}

/* ======================================
   RESTORE SETTINGS
====================================== */

restore(){

const position=

localStorage.getItem(

"notifyPosition"

);

if(position){

this.setPosition(position);

}

}

/* ======================================
   HELPERS
====================================== */

success(message,duration){

this.show(

message,

"success",

duration

);

}

error(message,duration){

this.show(

message,

"error",

duration

);

}

warning(message,duration){

this.show(

message,

"warning",

duration

);

}

info(message,duration){

this.show(

message,

"info",

duration

);

}

/* ======================================
   PERSISTENT
====================================== */

persistent(message,type="info"){

this.show(

message,

type,

600000

);

}
  /* ==========================================================
   GameVerse Pro
   Production Notification System
   Part 4 / 4
========================================================== */

const notificationManager=new NotificationManager();

notificationManager.restore();

/* ======================================
   GLOBAL HELPERS
====================================== */

function notify(message,type="success",duration){

notificationManager.show(

message,

type,

duration

);

}

function notifySuccess(message,duration){

notificationManager.success(

message,

duration

);

}

function notifyError(message,duration){

notificationManager.error(

message,

duration

);

}

function notifyWarning(message,duration){

notificationManager.warning(

message,

duration

);

}

function notifyInfo(message,duration){

notificationManager.info(

message,

duration

);

}

/* ======================================
   AUTO EVENTS
====================================== */

window.addEventListener("offline",()=>{

notifyWarning(

"Internet connection lost"

);

});

window.addEventListener("online",()=>{

notifySuccess(

"Internet connected"

);

});

/* ======================================
   MODULE INFO
====================================== */

const NOTIFICATION_MODULE={

module:"Notifications",

version:"3.0.0",

status:"Production Ready"

};

console.table(NOTIFICATION_MODULE);

console.log("🔔 notifications.js Loaded");
