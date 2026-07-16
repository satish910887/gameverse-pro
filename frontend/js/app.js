/* ==========================================================
   GAMEVERSE PRO
   MAIN APPLICATION
   PART 1 / 4
========================================================== */

document.addEventListener("DOMContentLoaded", bootGameVerse);

async function bootGameVerse(){

console.log("🎮 GameVerse Pro Booting...");

showLoader();

initTheme();

initAudio();

initializeNavbar();

initializeScrollEffects();

bindGlobalEvents();

await loadInitialData();

hideLoader();

console.log("✅ GameVerse Ready");

}

// ======================================
// Loader
// ======================================

function showLoader(){

const loader=document.getElementById("loader");

if(loader){

loader.style.display="flex";

loader.style.opacity="1";

}

}

function hideLoader(){

const loader=document.getElementById("loader");

if(!loader)return;

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},500);

}

// ======================================
// Initial Data
// ======================================

async function loadInitialData(){

try{

if(typeof loadLeaderboard==="function"){

await loadLeaderboard();

}

if(localStorage.getItem("token")){

if(typeof loadProfile==="function"){

await loadProfile();

}

}

}catch(err){

console.error(err);

notify("Unable to load data");

}

}

// ======================================
// Theme
// ======================================

function initTheme(){

const saved=

localStorage.getItem("theme")||

"dark";

document.body.setAttribute(

"data-theme",

saved

);

}

function toggleTheme(){

const current=

document.body.getAttribute("data-theme");

const next=

current==="dark"

?

"light"

:

"dark";

document.body.setAttribute(

"data-theme",

next

);

localStorage.setItem(

"theme",

next

);

notify(

"Theme Changed"

);

}

// ======================================
// Audio
// ======================================

function initAudio(){

if(typeof audioManager!=="undefined"){

audioManager.restoreSettings();

}

}
/* ==========================================================
   GAMEVERSE PRO
   MAIN APPLICATION
   PART 2 / 4
========================================================== */

// ======================================
// LOGIN CHECK
// ======================================

function checkLogin(){

const token=

localStorage.getItem("token");

if(!token){

console.log("Guest Mode");

return false;

}

console.log("User Logged In");

return true;

}

// ======================================
// NAVBAR
// ======================================

function initializeNavbar(){

const navbar=

document.querySelector(".navbar");

if(!navbar)return;

window.addEventListener(

"scroll",

()=>{

if(window.scrollY>50){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

}

);

}

// ======================================
// SCROLL ANIMATION
// ======================================

function initializeScrollEffects(){

const sections=

document.querySelectorAll("section");

const observer=

new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("fadeIn");

}

});

},

{

threshold:.15

}

);

sections.forEach(section=>{

observer.observe(section);

});

}

// ======================================
// EVENTS
// ======================================

function bindGlobalEvents(){

checkLogin();

const rewardBtn=

document.getElementById(

"dailyRewardBtn"

);

if(rewardBtn){

rewardBtn.addEventListener(

"click",

claimDailyReward

);

}

window.addEventListener(

"offline",

()=>{

notify(

"No Internet Connection"

);

}

);

window.addEventListener(

"online",

()=>{

notify(

"Internet Connected"

);

}

);

}

// ======================================
// DAILY REWARD
// ======================================

function claimDailyReward(){

if(typeof playCoinSound==="function"){

playCoinSound();

}

notify(

"Daily Reward Claimed 🎉"

);

}
/* ==========================================================
   GAMEVERSE PRO
   MAIN APPLICATION
   PART 3 / 4
========================================================== */

// ======================================
// REFRESH USER
// ======================================

function refreshUser(){

if(typeof loadProfile==="function"){

loadProfile();

}

if(typeof loadLeaderboard==="function"){

loadLeaderboard();

}

}

// ======================================
// NOTIFICATION
// ======================================

function notify(message,type="success"){

if(typeof showToast==="function"){

showToast(message,type);

}else{

console.log(message);

}

if(typeof playNotificationSound==="function"){

playNotificationSound();

}

}

// ======================================
// GAME LAUNCHER
// ======================================

function launchGame(game){
notify("Launching "+game+"...");
setTimeout(()=>{
window.location.href=
"games/"+game+"/"+game+".html";
},700);
}

// ======================================
// SCROLL TO GAMES
// ======================================

function scrollToGames(){

const games=

document.getElementById("games");

if(games){

games.scrollIntoView({

behavior:"smooth",

block:"start"

});

}

}

// ======================================
// HELPERS
// ======================================

function $(id){

return document.getElementById(id);

}

function $all(selector){

return document.querySelectorAll(selector);

}

function sleep(ms){

return new Promise(resolve=>{

setTimeout(resolve,ms);

});

}

// ======================================
// PAGE VISIBILITY
// ======================================

document.addEventListener(

"visibilitychange",

()=>{

if(document.hidden){

console.log("GameVerse Paused");

}else{

console.log("GameVerse Active");

}

}

);
/* ==========================================================
   GAMEVERSE PRO
   MAIN APPLICATION
   PART 4 / 4
========================================================== */

// ======================================
// CONNECTION STATUS
// ======================================

function updateConnectionStatus(){

if(navigator.onLine){

notify("🟢 Online");

}else{

notify("🔴 Offline","error");

}

}

window.addEventListener("online",updateConnectionStatus);
window.addEventListener("offline",updateConnectionStatus);

// ======================================
// PERFORMANCE
// ======================================

function logPerformance(){

if(window.performance){

const loadTime=

Math.round(

performance.now()

);

console.log(

"⚡ Loaded in",

loadTime,

"ms"

);

}

}

// ======================================
// KEYBOARD SHORTCUTS
// ======================================

document.addEventListener("keydown",(e)=>{

// Ctrl + /

if(e.ctrlKey && e.key==="/"){

e.preventDefault();

toggleTheme();

}

// Escape closes modals

if(e.key==="Escape"){

document

.querySelectorAll(".modal")

.forEach(modal=>{

modal.classList.remove("active");

});

}

});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

window.onerror=function(

message,

source,

line,

column,

error

){

console.error(

"App Error:",

message,

source,

line,

column,

error

);

notify(

"Something went wrong",

"error"

);

return false;

};

// ======================================
// UNHANDLED PROMISES
// ======================================

window.addEventListener(

"unhandledrejection",

(event)=>{

console.error(

event.reason

);

notify(

"Unexpected Error",

"error"

);

}

);

// ======================================
// APP INFO
// ======================================

const APP={

name:"GameVerse Pro",

version:"2.0.0",

author:"Satish",

build:"Production"

};

console.table(APP);

// ======================================
// FINAL STARTUP
// ======================================

window.addEventListener("load",()=>{

logPerformance();

updateConnectionStatus();

console.log(

"🎮 GameVerse Pro Ready"

);

});
