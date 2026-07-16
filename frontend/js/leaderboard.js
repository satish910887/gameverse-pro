/* ==========================================================
   GAMEVERSE PRO
   LEADERBOARD SYSTEM
   PART 1 / 4
========================================================== */

const leaderboardContainer =
document.getElementById("leaderboardList");

let leaderboardData=[];

/* ======================================
   LOAD LEADERBOARD
====================================== */

async function loadLeaderboard(

game="all",

period="alltime"

){

try{

showLoader();

const res=

await apiRequest(

`/leaderboard?game=${game}&period=${period}`

);

leaderboardData=

res.leaderboard||[];

renderLeaderboard(

leaderboardData

);

}catch(err){

notify(

"Unable to load leaderboard",

"error"

);

console.error(err);

}finally{

hideLoader();

}

}

/* ======================================
   RENDER
====================================== */

function renderLeaderboard(players){

if(!leaderboardContainer)return;

leaderboardContainer.innerHTML="";

if(players.length===0){

leaderboardContainer.innerHTML=`

<div class="leaderboard-row">

<span>No Players Found</span>

</div>

`;

return;

}

players.forEach((player,index)=>{

const row=

createPlayerRow(

player,

index

);

leaderboardContainer.appendChild(row);

});

}

/* ======================================
   PLAYER ROW
====================================== */

function createPlayerRow(

player,

index

){

const row=

document.createElement("div");

row.className=

"leaderboard-row fadeIn";

const medal=

getRank(index);

row.innerHTML=`

<span class="rank">

${medal}

</span>

<span class="player">

${player.user?.name||"Unknown"}

</span>

<span>

Lv.${player.user?.level||1}

</span>

<span class="score">

${formatNumber(

player.score||0

)}

</span>

`;

return row;

}

/* ======================================
   MEDALS
====================================== */

function getRank(index){

if(index===0) return "🥇";

if(index===1) return "🥈";

if(index===2) return "🥉";

return "#"+(index+1);

}
/* ==========================================================
   GAMEVERSE PRO
   LEADERBOARD SYSTEM
   PART 2 / 4
========================================================== */

/* ======================================
   MY RANK
====================================== */

async function loadMyRank(){

try{

const res=

await apiRequest(

"/leaderboard/my-rank"

);

updateMyRank(

res.rank

);

}catch(err){

console.error(err);

}

}

function updateMyRank(rank){

const box=

document.getElementById("myRank");

if(!box) return;

box.innerHTML=

`🏅 Your Rank : #${rank||"--"}`;

}

/* ======================================
   CURRENT USER
====================================== */

function highlightCurrentUser(){

const user=

getUser();

if(!user)return;

document

.querySelectorAll(".leaderboard-row")

.forEach(row=>{

if(

row.innerText.includes(user.name)

){

row.style.border=

"2px solid #6C63FF";

row.style.background=

"rgba(108,99,255,.15)";

}

});

}

/* ======================================
   TOP 3 PODIUM
====================================== */

function decorateTopPlayers(){

const rows=

document.querySelectorAll(

".leaderboard-row"

);

rows.forEach((row,index)=>{

if(index===0){

row.style.boxShadow=

"0 0 25px gold";

}

if(index===1){

row.style.boxShadow=

"0 0 20px silver";

}

if(index===2){

row.style.boxShadow=

"0 0 18px #cd7f32";

}

});

}

/* ======================================
   AUTO REFRESH
====================================== */

setInterval(async()=>{

await loadLeaderboard();

highlightCurrentUser();

decorateTopPlayers();

},30000);

/* ======================================
   INITIAL LOAD
====================================== */

window.addEventListener("load",async()=>{

await loadLeaderboard();

decorateTopPlayers();

highlightCurrentUser();

if(getToken()){

loadMyRank();

}

});
/* ==========================================================
   GAMEVERSE PRO
   LEADERBOARD SYSTEM
   PART 3 / 4
========================================================== */

/* ======================================
   SEARCH PLAYER
====================================== */

function searchLeaderboard(keyword){

if(!keyword){

renderLeaderboard(leaderboardData);

decorateTopPlayers();

highlightCurrentUser();

return;

}

const filtered=

leaderboardData.filter(player=>{

const name=

player.user?.name||

"";

return name

.toLowerCase()

.includes(

keyword.toLowerCase()

);

});

renderLeaderboard(filtered);

decorateTopPlayers();

highlightCurrentUser();

}

/* ======================================
   SORT
====================================== */

function sortLeaderboard(){

leaderboardData.sort(

(a,b)=>

(b.score||0)-(a.score||0)

);

renderLeaderboard(

leaderboardData

);

decorateTopPlayers();

highlightCurrentUser();

}

/* ======================================
   RANK ANIMATION
====================================== */

function animateLeaderboard(){

const rows=

document.querySelectorAll(

".leaderboard-row"

);

rows.forEach((row,index)=>{

row.animate([

{

opacity:0,

transform:"translateY(20px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],{

duration:400+(index*100),

fill:"forwards"

});

});

}

/* ======================================
   LIVE SCORE UPDATE
====================================== */

function updatePlayerScore(

playerName,

newScore

){

const player=

leaderboardData.find(

p=>p.user?.name===playerName

);

if(player){

player.score=newScore;

sortLeaderboard();

animateLeaderboard();

}

}

/* ======================================
   TOTAL PLAYERS
====================================== */

function getLeaderboardCount(){

return leaderboardData.length;

}

console.log(

"Leaderboard Players:",

getLeaderboardCount()

);
/* ==========================================================
   GAMEVERSE PRO
   LEADERBOARD SYSTEM
   PART 4 / 4
========================================================== */

/* ======================================
   CACHE
====================================== */

function cacheLeaderboard(){

saveData(

"leaderboardCache",

leaderboardData

);

}

function loadCachedLeaderboard(){

const cache=

getData("leaderboardCache");

if(cache && cache.length){

leaderboardData=cache;

renderLeaderboard(cache);

decorateTopPlayers();

highlightCurrentUser();

}

}

/* ======================================
   REFRESH
====================================== */

async function refreshLeaderboard(){

await loadLeaderboard();

animateLeaderboard();

decorateTopPlayers();

highlightCurrentUser();

cacheLeaderboard();

}

/* ======================================
   PERFORMANCE
====================================== */

function optimizeLeaderboard(){

const rows=

document.querySelectorAll(

".leaderboard-row"

);

rows.forEach(row=>{

row.style.willChange=

"transform,opacity";

});

}

/* ======================================
   EXPORT DATA
====================================== */

function exportLeaderboard(){

const data=

JSON.stringify(

leaderboardData,

null,

2

);

console.log(data);

return data;

}

/* ======================================
   INITIALIZATION
====================================== */

window.addEventListener(

"load",

async()=>{

loadCachedLeaderboard();

await refreshLeaderboard();

optimizeLeaderboard();

if(getToken()){

loadMyRank();

}

});

/* ======================================
   AUTO SAVE CACHE
====================================== */

setInterval(()=>{

cacheLeaderboard();

},60000);

/* ======================================
   MODULE INFO
====================================== */

const LEADERBOARD_MODULE={

module:"Leaderboard",

version:"2.0.0",

status:"Production Ready"

};

console.table(LEADERBOARD_MODULE);

console.log("✅ leaderboard.js Loaded");
