/* ==========================================================
   GAMEVERSE PRO
   GAME LAUNCHER
   PART 1 / 4
========================================================== */

const GAME_CONFIG={

ludo:{
title:"🎲 Ludo",
src:"games/ludo/ludo.html",
category:"Board"
},

chess:{
title:"♟ Chess",
src:"games/chess/chess.html",
category:"Strategy"
},

runner:{
title:"🏃 Runner",
src:"games/runner/runner.html",
category:"Arcade"
},

survival:{
title:"🔥 Survival",
src:"games/survival/survival.html",
category:"Action"
},

puzzle:{
title:"🧩 Puzzle",
src:"games/puzzle/puzzle.html",
category:"Puzzle"
}

};

let currentGame=null;

/* ======================================
   LAUNCH GAME
====================================== */

function launchGame(gameName){

const game=

GAME_CONFIG[gameName];

if(!game){

notify(

"Game Not Found",

"error"

);

return;

}

currentGame=gameName;

saveLastGame(gameName);

addRecentGame(gameName);

openGameModal(game);

}

/* ======================================
   FAVORITES
====================================== */

function addFavoriteGame(game){

let fav=

getData("favoriteGames")||[];

if(!fav.includes(game)){

fav.push(game);

saveData(

"favoriteGames",

fav

);

}

}

function getFavoriteGames(){

return getData(

"favoriteGames"

)||[];

}

/* ======================================
   RECENT GAMES
====================================== */

function addRecentGame(game){

let recent=

getData("recentGames")||[];

recent=

recent.filter(

g=>g!==game

);

recent.unshift(game);

recent=

recent.slice(0,5);

saveData(

"recentGames",

recent

);

}

function getRecentGames(){

return getData(

"recentGames"

)||[];

}

/* ======================================
   LAST GAME
====================================== */

function saveLastGame(game){

saveData(

"lastGame",

game

);

}

function getLastGame(){

return getData(

"lastGame"

);

}

console.log("🎮 Game Launcher Part 1 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   GAME LAUNCHER
   PART 2 / 4
========================================================== */

/* ======================================
   GAME MODAL
====================================== */

function openGameModal(game){

let modal=

document.getElementById(

"gameModal"

);

if(!modal){

modal=

createGameModal();

document.body.appendChild(

modal

);

}

modal.classList.add(

"active"

);

document.getElementById("#gameTitle").textContent=

game.title;

showLoadingOverlay();

setTimeout(()=>{

document.getElementById("#gameFrame").src=

game.src;

hideLoadingOverlay();

},1200);

}

/* ======================================
   CREATE MODAL
====================================== */

function createGameModal(){

const modal=

document.createElement("div");

modal.id="gameModal";

modal.className="modal";

modal.innerHTML=`

<div class="modal-content"

style="width:95%;max-width:1200px;height:90vh;">

<div style="display:flex;justify-content:space-between;align-items:center;">

<h2 id="gameTitle"></h2>

<button onclick="closeGame()">

✖

</button>

</div>

<div id="gameLoading"

style="padding:20px;text-align:center;">

Launching Game...

</div>

<iframe

id="gameFrame"

style="width:100%;height:80vh;border:none;display:none;">

</iframe>

</div>

`;

return modal;

}

/* ======================================
   LOADING
====================================== */

function showLoadingOverlay(){

const loader=

document.getElementById("#gameLoading");

const frame=

document.getElementById("#gameFrame");

if(loader) loader.style.display="block";

if(frame) frame.style.display="none";

}

function hideLoadingOverlay(){

const loader=

document.getElementById("#gameLoading");

const frame=

document.getElementById("#gameFrame");

if(loader) loader.style.display="none";

if(frame) frame.style.display="block";

}

/* ======================================
   CLOSE GAME
====================================== */

function closeGame(){

const modal=

document.getElementById("#gameModal");

if(!modal)return;

modal.classList.remove(

"active"

);

document.getElementById("#gameFrame").src="";

currentGame=null;

}

/* ======================================
   RESUME LAST GAME
====================================== */

function resumeLastGame(){

const game=

getLastGame();

if(

game &&

GAME_CONFIG[game]

){

launchGame(game);

}

}
/* ==========================================================
   GAMEVERSE PRO
   GAME LAUNCHER
   PART 3 / 4
========================================================== */

/* ======================================
   CONNECTION
====================================== */

function checkConnection(){

if(!navigator.onLine){

notify(

"No Internet Connection",

"error"

);

return false;

}

return true;

}

/* ======================================
   QUICK MATCH
====================================== */

async function quickMatch(){

if(!checkConnection()) return;

try{

showLoader();

const res=

await apiRequest(

"/matchmaking/quick",

"POST"

);

notify(

"Match Found!"

);

joinRoom(

res.roomId

);

}catch(err){

notify(

err.message,

"error"

);

}finally{

hideLoader();

}

}

/* ======================================
   PRIVATE ROOM
====================================== */

async function createPrivateRoom(){

try{

const res=

await apiRequest(

"/matchmaking/create",

"POST"

);

prompt(

"Share Room Code",

res.roomCode

);

}catch(err){

notify(

err.message,

"error"

);

}

}

/* ======================================
   JOIN ROOM
====================================== */

async function joinRoom(roomCode){

if(!roomCode) return;

try{

await apiRequest(

"/matchmaking/join",

"POST",

{

roomCode

}

);

notify(

"Room Joined"

);

}catch(err){

notify(

err.message,

"error"

);

}

}

/* ======================================
   MULTIPLAYER
====================================== */

function startMultiplayer(game){

if(!checkConnection()) return;

currentGame=game;

quickMatch();

}

/* ======================================
   SINGLE PLAYER
====================================== */

function startSinglePlayer(game){

launchGame(game);

}
/* ==========================================================
   GAMEVERSE PRO
   GAME LAUNCHER
   PART 4 / 4
========================================================== */

/* ======================================
   SCORE SUBMISSION
====================================== */

async function submitGameScore(

score,

result="win"

){

try{

if(

typeof antiCheat!=="undefined" &&

!antiCheat.verify(score)

){

notify(

"Invalid Score",

"error"

);

return;

}

await apiRequest(

"/game/end",

"POST",

{

game:currentGame,

score,

result

}

);

notify(

"Score Submitted"

);

if(typeof playWinSound==="function"){

playWinSound();

}

if(typeof loadLeaderboard==="function"){

loadLeaderboard();

}

}catch(err){

notify(

err.message,

"error"

);

}

}

/* ======================================
   GAME EVENTS
====================================== */

window.addEventListener(

"message",

(event)=>{

if(!event.data) return;

if(event.data.type==="GAME_OVER"){

submitGameScore(

event.data.score||0,

event.data.result||"win"

);

}

}

);

/* ======================================
   CACHE
====================================== */

function cacheLauncher(){

saveData(

"launcherCache",

{

currentGame,

recent:getRecentGames(),

favorites:getFavoriteGames()

}

);

}

/* ======================================
   INITIALIZE
====================================== */

window.addEventListener(

"load",

()=>{

const last=

getLastGame();

if(last){

console.log(

"Last Played:",

last

);

}

cacheLauncher();

}

);

/* ======================================
   AUTO SAVE
====================================== */

setInterval(

cacheLauncher,

60000

);

/* ======================================
   MODULE INFO
====================================== */

const GAME_LAUNCHER_MODULE={

module:"Game Launcher",

version:"2.0.0",

status:"Production Ready"

};

console.table(

GAME_LAUNCHER_MODULE

);

console.log(

"✅ game-launcher.js Loaded"

);
