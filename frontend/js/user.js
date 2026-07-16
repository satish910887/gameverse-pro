/* ==========================================================
   GAMEVERSE PRO
   USER SYSTEM
   PART 1 / 4
========================================================== */

let currentUser=null;

/* ======================================
   LOAD PROFILE
====================================== */

async function loadProfile(){

try{

const res=

await apiRequest("/user/profile");

currentUser=res.user;

renderProfile(currentUser);

updateXPBar(

currentUser.xp||0,

currentUser.level||1

);

}catch(err){

notify(

err.message,

"error"

);

}

}

/* ======================================
   PROFILE UI
====================================== */

function renderProfile(user){

$("#playerName").textContent=

user.name||"Guest Player";

$("#playerLevel").textContent=

user.level||1;

$("#playerXP").textContent=

formatNumber(

user.xp||0

);

$("#playerCoins").textContent=

formatNumber(

user.coins||0

);

const gems=

$("#playerGems");

if(gems){

gems.textContent=

formatNumber(

user.gems||0

);

}

const avatar=

$("#profileAvatar");

if(

avatar &&

user.avatar

){

avatar.src=user.avatar;

}

updateBadge(

user.level||1

);

}

/* ======================================
   BADGE
====================================== */

function updateBadge(level){

const badge=

getBadge(level);

const name=

$("#playerName");

if(name){

name.innerHTML=

`${currentUser.name}<br><small>${badge}</small>`;

}

}

/* ======================================
   XP BAR
====================================== */

function updateXPBar(

xp,

level

){

const fill=

$("#xpBar");

if(!fill) return;

const max=

level*1000;

const percent=

Math.min(

100,

(xp/max)*100

);

fill.style.width=

percent+"%";

  }
/* ==========================================================
   GAMEVERSE PRO
   USER SYSTEM
   PART 2 / 4
========================================================== */

/* ======================================
   DAILY REWARD
====================================== */

async function claimDailyReward(){

try{

showLoader();

const res=

await apiRequest(

"/user/daily-reward",

"POST"

);

notify(

res.message||

"Reward Claimed 🎁"

);

animateCoins(100);

loadProfile();

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
   COIN ANIMATION
====================================== */

function animateCoins(amount){

const coins=

$("#playerCoins");

if(!coins)return;

coins.animate([

{

transform:"scale(1)"

},

{

transform:"scale(1.25)"

},

{

transform:"scale(1)"

}

],{

duration:500

});

}

/* ======================================
   LEVEL CHECK
====================================== */

function checkLevelUp(user){

const required=

(user.level||1)*1000;

if(user.xp>=required){

notify(

"🎉 Level Up!",

"success"

);

}

}

/* ======================================
   ACHIEVEMENTS
====================================== */

function getAchievements(user){

const list=[];

if(user.level>=10){

list.push("⭐ Elite");

}

if(user.level>=25){

list.push("💎 Pro");

}

if(user.level>=50){

list.push("🔥 Master");

}

if(user.level>=100){

list.push("👑 Legend");

}

return list;

}

/* ======================================
   DAILY MISSIONS
====================================== */

function loadDailyMissions(){

return [

{

title:"Play 3 Games",

reward:100

},

{

title:"Win 1 Match",

reward:50

},

{

title:"Login Today",

reward:25

}

];

}
/* ==========================================================
   GAMEVERSE PRO
   USER SYSTEM
   PART 3 / 4
========================================================== */

/* ======================================
   MATCH HISTORY
====================================== */

async function loadHistory(){

try{

const res=

await apiRequest(

"/game/history"

);

updateStatistics(

res.history||[]

);

}catch(err){

console.error(err);

}

}

/* ======================================
   PLAYER STATS
====================================== */

function updateStatistics(history){

const total=

history.length;

const wins=

history.filter(

game=>game.result==="win"

).length;

const losses=

total-wins;

const winRate=

total

?

Math.round((wins/total)*100)

:

0;

console.table({

Games:total,

Wins:wins,

Losses:losses,

WinRate:winRate+"%"

});

}

/* ======================================
   AUTO SAVE
====================================== */

function autoSaveProfile(){

if(!currentUser) return;

saveUser(currentUser);

}

setInterval(

autoSaveProfile,

60000

);

/* ======================================
   LAST LOGIN
====================================== */

function updateLastLogin(){

localStorage.setItem(

"lastLogin",

new Date().toISOString()

);

}

function getLastLogin(){

return localStorage.getItem(

"lastLogin"

);

}

/* ======================================
   PLAYER RANK
====================================== */

function getPlayerRank(level){

if(level>=100) return "Legend";

if(level>=75) return "Champion";

if(level>=50) return "Master";

if(level>=25) return "Diamond";

if(level>=10) return "Elite";

return "Beginner";

}

/* ======================================
   PROFILE REFRESH
====================================== */

function refreshProfile(){

loadProfile();

loadHistory();

}
/* ==========================================================
   GAMEVERSE PRO
   USER SYSTEM
   PART 4 / 4
========================================================== */

/* ======================================
   PROFILE CACHE
====================================== */

function cacheProfile(){

if(currentUser){

saveData(

"profileCache",

currentUser

);

}

}

function loadCachedProfile(){

const cache=

getData("profileCache");

if(cache){

renderProfile(cache);

}

}

/* ======================================
   CLOUD SYNC READY
====================================== */

async function syncProfile(){

if(!currentUser) return;

try{

await apiRequest(

"/user/sync",

"POST",

currentUser

);

console.log(

"☁ Profile Synced"

);

}catch(err){

console.warn(

"Sync Failed"

);

}

}

/* ======================================
   PROFILE REFRESH
====================================== */

async function refreshProfile(){

await loadProfile();

await loadHistory();

cacheProfile();

}

/* ======================================
   INITIALIZATION
====================================== */

window.addEventListener(

"load",

async()=>{

loadCachedProfile();

if(getToken()){

await refreshProfile();

updateLastLogin();

}

}

/* ======================================
   AUTO SYNC
====================================== */

setInterval(()=>{

if(getToken()){

syncProfile();

}

},300000);

/* ======================================
   USER VERSION
====================================== */

const USER_MODULE={

module:"User",

version:"2.0.0",

status:"Production Ready"

};

console.table(USER_MODULE);

console.log("✅ user.js Loaded");
