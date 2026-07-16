/* ==========================================================
   GAMEVERSE PRO
   AUTHENTICATION SYSTEM
   PART 1 / 4
========================================================== */

const loginBtn=document.getElementById("loginBtn");
const loginModal=document.getElementById("loginModal");
const signupModal=document.getElementById("signupModal");

const loginEmail=document.getElementById("loginEmail");
const loginPassword=document.getElementById("loginPassword");

const signupName=document.getElementById("signupName");
const signupEmail=document.getElementById("signupEmail");
const signupPassword=document.getElementById("signupPassword");

/* ======================================
   INIT
====================================== */

document.addEventListener(

"DOMContentLoaded",

initializeAuth

);

function initializeAuth(){

bindModalEvents();

bindAuthButtons();

checkLoggedUser();

}

/* ======================================
   MODALS
====================================== */

function openLogin(){

if(loginModal){

loginModal.classList.add("active");

}

}

function closeLogin(){

if(loginModal){

loginModal.classList.remove("active");

}

}

function openSignupModal(){

closeLogin();

if(signupModal){

signupModal.classList.add("active");

}

}

function closeSignup(){

if(signupModal){

signupModal.classList.remove("active");

}

}

/* ======================================
   EVENTS
====================================== */

function bindModalEvents(){

if(loginBtn){

loginBtn.addEventListener(

"click",

openLogin

);

}

const signupLink=

document.getElementById(

"openSignup"

);

if(signupLink){

signupLink.addEventListener(

"click",

openSignupModal

);

}

window.addEventListener(

"click",

(e)=>{

if(e.target===loginModal){

closeLogin();

}

if(e.target===signupModal){

closeSignup();

}

}

);

}

/* ======================================
   VALIDATION
====================================== */

function validateEmail(email){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validatePassword(password){

return password.length>=6;

}

function validateSignup(){

if(!signupName.value.trim()){

notify("Enter Name");

return false;

}

if(!validateEmail(signupEmail.value)){

notify("Invalid Email");

return false;

}

if(!validatePassword(signupPassword.value)){

notify("Password must be at least 6 characters");

return false;

}

return true;

}

function validateLogin(){

if(!validateEmail(loginEmail.value)){

notify("Invalid Email");

return false;

}

if(!validatePassword(loginPassword.value)){

notify("Invalid Password");

return false;

}

return true;

}
/* ==========================================================
   GAMEVERSE PRO
   AUTHENTICATION SYSTEM
   PART 2 / 4
========================================================== */

/* ======================================
   AUTH BUTTONS
====================================== */

function bindAuthButtons(){

const loginSubmit=

document.getElementById("loginSubmit");

const signupSubmit=

document.getElementById("signupSubmit");

if(loginSubmit){

loginSubmit.addEventListener(

"click",

loginUser

);

}

if(signupSubmit){

signupSubmit.addEventListener(

"click",

registerUser

);

}

}

/* ======================================
   REGISTER
====================================== */

async function registerUser(){

if(!validateSignup()) return;

try{

showLoader();

const data={

name:signupName.value.trim(),

email:signupEmail.value.trim(),

password:signupPassword.value

};

const res=

await apiRequest(

"/auth/register",

"POST",

data

);

notify(

res.message||

"Registration Successful"

);

closeSignup();

openLogin();

}catch(err){

notify(

err.message||

"Registration Failed",

"error"

);

}finally{

hideLoader();

}

}

/* ======================================
   LOGIN
====================================== */

async function loginUser(){

if(!validateLogin()) return;

try{

showLoader();

const data={

email:loginEmail.value.trim(),

password:loginPassword.value

};

const res=

await apiRequest(

"/auth/login",

"POST",

data

);

saveToken(res.token);

saveUser(res.user);

localStorage.setItem(

"rememberLogin",

"true"

);

notify("Welcome Back 🎉");

closeLogin();

setTimeout(()=>{

location.reload();

},600);

}catch(err){

notify(

err.message||

"Login Failed",

"error"

);

}finally{

hideLoader();

}

  }
/* ==========================================================
   GAMEVERSE PRO
   AUTHENTICATION SYSTEM
   PART 3 / 4
========================================================== */

/* ======================================
   AUTO LOGIN
====================================== */

function checkLoggedUser(){

const user=getUser();

if(!user){

return;

}

if(loginBtn){

loginBtn.innerHTML="🚪 Logout";

loginBtn.onclick=userLogout;

}

}

/* ======================================
   LOGOUT
====================================== */

function userLogout(){

if(typeof logout==="function"){

logout();

}

localStorage.removeItem("rememberLogin");

localStorage.removeItem("token");

localStorage.removeItem("user");

notify("Logged Out Successfully");

setTimeout(()=>{

location.reload();

},600);

}

/* ======================================
   PASSWORD STRENGTH
====================================== */

if(signupPassword){

signupPassword.addEventListener(

"input",

checkPasswordStrength

);

}

function checkPasswordStrength(){

const value=signupPassword.value;

let score=0;

if(value.length>=8) score++;

if(/[A-Z]/.test(value)) score++;

if(/[0-9]/.test(value)) score++;

if(/[!@#$%^&*]/.test(value)) score++;

let strength="Weak";

if(score===2){

strength="Medium";

}

if(score>=3){

strength="Strong";

}

console.log("Password:",strength);

}

/* ======================================
   ENTER KEY LOGIN
====================================== */

document.addEventListener(

"keydown",

(e)=>{

if(e.key==="Enter"){

if(loginModal.classList.contains("active")){

loginUser();

}

if(signupModal.classList.contains("active")){

registerUser();

}

}

}

/* ======================================
   SESSION CHECK
====================================== */

setInterval(()=>{

const token=

localStorage.getItem("token");

if(!token){

return;

}

console.log("Session Active");

},60000);
/* ==========================================================
   GAMEVERSE PRO
   AUTHENTICATION SYSTEM
   PART 4 / 4
========================================================== */

/* ======================================
   TOKEN VALIDATION
====================================== */

function isLoggedIn(){

const token=localStorage.getItem("token");

return !!token;

}

/* ======================================
   SESSION RESTORE
====================================== */

window.addEventListener("load",()=>{

if(isLoggedIn()){

console.log("✅ Session Restored");

}

});

/* ======================================
   AUTO LOGOUT (OPTIONAL)
====================================== */

const SESSION_TIME=24*60*60*1000;

function saveLoginTime(){

localStorage.setItem(

"loginTime",

Date.now()

);

}

function checkSessionExpiry(){

const loginTime=

Number(localStorage.getItem("loginTime"));

if(!loginTime)return;

if(Date.now()-loginTime>SESSION_TIME){

userLogout();

notify(

"Session Expired",

"error"

);

}

}

checkSessionExpiry();

/* ======================================
   AUTH ERROR HANDLER
====================================== */

window.addEventListener(

"unhandledrejection",

(event)=>{

console.error(event.reason);

notify(

"Authentication Error",

"error"

);

});

/* ======================================
   CLEAR AUTH FORMS
====================================== */

function clearAuthForms(){

if(loginEmail) loginEmail.value="";

if(loginPassword) loginPassword.value="";

if(signupName) signupName.value="";

if(signupEmail) signupEmail.value="";

if(signupPassword) signupPassword.value="";

}

/* ======================================
   LOGIN SUCCESS
====================================== */

function onLoginSuccess(){

saveLoginTime();

clearAuthForms();

notify("Welcome to GameVerse Pro 🎮");

}

/* ======================================
   VERSION
====================================== */

console.log({

module:"Authentication",

version:"2.0.0",

status:"Ready"

});

console.log("✅ auth.js Loaded");
