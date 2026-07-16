/* ==========================================================
   GAMEVERSE PRO
   UTILITY ENGINE
   PART 1 / 4
========================================================== */

const API_URL="/api";

/* ======================================
   API REQUEST
====================================== */

async function apiRequest(

endpoint,

method="GET",

data=null

){

const token=

localStorage.getItem("token");

const options={

method,

headers:{

"Content-Type":"application/json"

}

};

if(token){

options.headers.Authorization=

`Bearer ${token}`;

}

if(data){

options.body=

JSON.stringify(data);

}

try{

const response=

await fetch(

API_URL+endpoint,

options

);

const result=

await response.json();

if(!response.ok){

throw new Error(

result.message||

"Server Error"

);

}

return result;

}catch(error){

console.error(error);

throw error;

}

}

/* ======================================
   LOADER
====================================== */

function showLoader(){

const loader=

document.getElementById("loader");

if(!loader) return;

loader.style.display="flex";

loader.style.opacity="1";

}

function hideLoader(){

const loader=

document.getElementById("loader");

if(!loader) return;

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},400);

}

/* ======================================
   DATE FORMAT
====================================== */

function formatDate(date){

return new Date(date)

.toLocaleDateString(

"en-IN",

{

day:"2-digit",

month:"short",

year:"numeric"

}

);

}
/* ==========================================================
   GAMEVERSE PRO
   UTILITY ENGINE
   PART 2 / 4
========================================================== */

/* ======================================
   PREMIUM TOAST
====================================== */

function showToast(

message,

type="success"

){

const toast=

document.createElement("div");

toast.className=

"notification show";

const colors={

success:"#22C55E",

error:"#EF4444",

warning:"#F59E0B",

info:"#3B82F6"

};

toast.style.borderLeft=

`5px solid ${

colors[type]||

colors.success

}`;

toast.innerHTML=`

<div>

<strong>${type.toUpperCase()}</strong>

<br>

<span>${message}</span>

</div>

`;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},400);

},3500);

}

/* ======================================
   NOTIFY
====================================== */

function notify(

message,

type="success"

){

showToast(

message,

type

);

}

/* ======================================
   COPY TO CLIPBOARD
====================================== */

async function copyText(text){

try{

await navigator.clipboard.writeText(text);

notify(

"Copied Successfully"

);

}catch{

notify(

"Copy Failed",

"error"

);

}

}

/* ======================================
   RANDOM ID
====================================== */

function generateId(

length=12

){

const chars=

"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

let id="";

for(

let i=0;

i<length;

i++

){

id+=chars.charAt(

Math.floor(

Math.random()*chars.length

)

);

}

return id;

}

/* ======================================
   NUMBER FORMAT
====================================== */

function formatNumber(value){

return Number(value)

.toLocaleString("en-IN");

}
/* ==========================================================
   GAMEVERSE PRO
   UTILITY ENGINE
   PART 3 / 4
========================================================== */

/* ======================================
   LOCAL STORAGE
====================================== */

function saveToken(token){

localStorage.setItem(

"token",

token

);

}

function getToken(){

return localStorage.getItem(

"token"

);

}

function removeToken(){

localStorage.removeItem(

"token"

);

}

/* ======================================
   USER
====================================== */

function saveUser(user){

localStorage.setItem(

"user",

JSON.stringify(user)

);

}

function getUser(){

const user=

localStorage.getItem(

"user"

);

return user

?

JSON.parse(user)

:

null;

}

function removeUser(){

localStorage.removeItem(

"user"

);

}

/* ======================================
   LOGOUT
====================================== */

function logout(){

removeToken();

removeUser();

localStorage.removeItem(

"rememberLogin"

);

notify(

"Logged Out Successfully"

);

setTimeout(()=>{

window.location.reload();

},600);

}

/* ======================================
   SESSION
====================================== */

function isLoggedIn(){

return !!getToken();

}

function getCurrentUser(){

return getUser();

}

/* ======================================
   STORAGE HELPERS
====================================== */

function saveData(key,value){

localStorage.setItem(

key,

JSON.stringify(value)

);

}

function getData(key){

const data=

localStorage.getItem(key);

return data

?

JSON.parse(data)

:

null;

}

function removeData(key){

localStorage.removeItem(key);

}
/* ==========================================================
   GAMEVERSE PRO
   UTILITY ENGINE
   PART 4 / 4
========================================================== */

/* ======================================
   NETWORK STATUS
====================================== */

function isOnline(){

return navigator.onLine;

}

window.addEventListener("online",()=>{

notify(

"Internet Connected",

"success"

);

});

window.addEventListener("offline",()=>{

notify(

"No Internet Connection",

"error"

);

});

/* ======================================
   DEVICE DETECTION
====================================== */

function getDeviceType(){

const width=

window.innerWidth;

if(width<=480){

return "Mobile";

}

if(width<=1024){

return "Tablet";

}

return "Desktop";

}

console.log(

"Device :",

getDeviceType()

);

/* ======================================
   PERFORMANCE
====================================== */

function appPerformance(){

const load=

Math.round(

performance.now()

);

console.log(

"⚡ Load Time:",

load+"ms"

);

}

window.addEventListener(

"load",

appPerformance

);

/* ======================================
   SCROLL
====================================== */

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

/* ======================================
   DEBOUNCE
====================================== */

function debounce(fn,delay=300){

let timer;

return function(){

clearTimeout(timer);

const args=arguments;

timer=setTimeout(()=>{

fn.apply(this,args);

},delay);

};

}

/* ======================================
   VERSION
====================================== */

const Utils={

version:"2.0.0",

build:"Production",

status:"Ready"

};

console.table(Utils);

console.log("✅ utils.js Loaded");
