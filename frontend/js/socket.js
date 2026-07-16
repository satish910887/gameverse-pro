/* ==========================================================
   GAMEVERSE PRO
   SOCKET SYSTEM
   PART 1 / 4
========================================================== */

let socket=null;

let reconnectTimer=null;

let heartbeatTimer=null;

let reconnectAttempts=0;

const MAX_RECONNECT=10;

/* ======================================
   CONNECT
====================================== */

function connectSocket(){

if(socket) return;

const protocol=

location.protocol==="https:"

?"wss://"

:"ws://";

socket=

new WebSocket(

protocol+

location.host+

"/ws"

);

registerSocketEvents();

}

/* ======================================
   EVENTS
====================================== */

function registerSocketEvents(){

socket.onopen=()=>{

console.log("🟢 Socket Connected");

reconnectAttempts=0;

authenticateSocket();

startHeartbeat();

notify("Connected");

};

socket.onmessage=(event)=>{

handleSocketMessage(

JSON.parse(event.data)

);

};

socket.onerror=(err)=>{

console.error(err);

};

socket.onclose=()=>{

console.log("🔴 Socket Closed");

stopHeartbeat();

socket=null;

scheduleReconnect();

};

}

/* ======================================
   AUTH
====================================== */

function authenticateSocket(){

const token=

localStorage.getItem("token");

if(

token &&

socket.readyState===1

){

socket.send(

JSON.stringify({

type:"AUTH",

token

})

);

}

}

/* ======================================
   HEARTBEAT
====================================== */

function startHeartbeat(){

heartbeatTimer=

setInterval(()=>{

if(

socket &&

socket.readyState===1

){

socket.send(

JSON.stringify({

type:"PING"

})

);

}

},30000);

}

function stopHeartbeat(){

clearInterval(

heartbeatTimer

);

}

/* ======================================
   RECONNECT
====================================== */

function scheduleReconnect(){

if(

reconnectAttempts>=

MAX_RECONNECT

){

return;

}

reconnectAttempts++;

reconnectTimer=

setTimeout(()=>{

connectSocket();

},3000);

}
/* ==========================================================
   GAMEVERSE PRO
   SOCKET SYSTEM
   PART 2 / 4
========================================================== */

/* ======================================
   MESSAGE HANDLER
====================================== */

function handleSocketMessage(data){

switch(data.type){

case "PONG":

break;

case "CHAT":

receiveChatMessage(data);

break;

case "NOTIFICATION":

notify(

data.message

);

break;

case "ONLINE_USERS":

updateOnlinePlayers(

data.players

);

break;

case "MATCH_FOUND":

notify(

"🎮 Match Found"

);

joinMatch(

data.roomId

);

break;

default:

console.log(data);

}

}

/* ======================================
   SEND
====================================== */

function sendSocket(type,payload={}){

if(

!socket ||

socket.readyState!==1

){

return;

}

socket.send(

JSON.stringify({

type,

...payload

})

);

}

/* ======================================
   CHAT
====================================== */

function sendChatMessage(message){

sendSocket(

"CHAT",

{

message

}

);

}

function receiveChatMessage(data){

console.log(

"💬",

data.user,

":",

data.message

);

}

/* ======================================
   ONLINE PLAYERS
====================================== */

function updateOnlinePlayers(players){

const box=

document.getElementById(

"onlinePlayers"

);

if(box){

box.textContent=

players;

}

}

/* ======================================
   JOIN MATCH
====================================== */

function joinMatch(roomId){

console.log(

"Joined Room:",

roomId

);

}
/* ==========================================================
   GAMEVERSE PRO
   SOCKET SYSTEM
   PART 3 / 4
========================================================== */

/* ======================================
   LIVE LEADERBOARD
====================================== */

function updateLeaderboardLive(data){

if(typeof loadLeaderboard==="function"){

loadLeaderboard();

}

notify(

"🏆 Leaderboard Updated"

);

}

/* ======================================
   MATCH STATUS
====================================== */

function updateMatchStatus(status){

const box=

document.getElementById(

"matchStatus"

);

if(box){

box.innerText=status;

}

}

/* ======================================
   LIVE REWARDS
====================================== */

function receiveReward(data){

notify(

`🎁 +${data.coins} Coins`

);

if(typeof loadProfile==="function"){

loadProfile();

}

}

/* ======================================
   EVENT QUEUE
====================================== */

const socketQueue=[];

function queueEvent(type,payload={}){

socketQueue.push({

type,

payload

});

}

function processQueue(){

while(

socketQueue.length>0

){

const event=

socketQueue.shift();

sendSocket(

event.type,

event.payload

);

}

}

/* ======================================
   EXTENDED EVENTS
====================================== */

const oldHandler=

handleSocketMessage;

handleSocketMessage=function(data){

oldHandler(data);

switch(data.type){

case "LEADERBOARD_UPDATE":

updateLeaderboardLive(data);

break;

case "MATCH_STATUS":

updateMatchStatus(

data.status

);

break;

case "REWARD":

receiveReward(data);

break;

case "QUEUE_PROCESS":

processQueue();

break;

}

};

console.log("✅ Socket Part 3 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   SOCKET SYSTEM
   PART 4 / 4
========================================================== */

/* ======================================
   CONNECTION STATS
====================================== */

const socketStats={

connected:false,

messagesSent:0,

messagesReceived:0,

lastPing:null

};

function updateSocketStatus(status){

socketStats.connected=status;

const el=

document.getElementById(

"socketStatus"

);

if(el){

el.innerText=

status

?

"🟢 Online"

:

"🔴 Offline";

}

}

/* ======================================
   SAFE SEND
====================================== */

function safeSend(type,payload={}){

if(

socket &&

socket.readyState===1

){

socketStats.messagesSent++;

sendSocket(type,payload);

}else{

queueEvent(type,payload);

}

}

/* ======================================
   LATENCY
====================================== */

function pingServer(){

socketStats.lastPing=

Date.now();

safeSend("PING");

}

setInterval(

pingServer,

30000

);

/* ======================================
   ERROR RECOVERY
====================================== */

window.addEventListener(

"offline",

()=>{

updateSocketStatus(false);

notify(

"No Internet",

"error"

);

}

);

window.addEventListener(

"online",

()=>{

notify("Reconnecting...");

connectSocket();

}

);

/* ======================================
   INITIALIZE
====================================== */

window.addEventListener(

"load",

()=>{

connectSocket();

updateSocketStatus(false);

}

);

/* ======================================
   MODULE INFO
====================================== */

const SOCKET_MODULE={

module:"Socket",

version:"2.0.0",

status:"Production Ready"

};

console.table(SOCKET_MODULE);

console.log("✅ socket.js Loaded");
