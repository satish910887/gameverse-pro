/* ==========================================================
   GameVerse Pro
   Production Router
   Part 1 / 4
========================================================== */

class Router{

constructor(){

this.routes={};

this.currentRoute="/";

this.notFound=null;

this.beforeHooks=[];

this.afterHooks=[];

window.addEventListener(

"hashchange",

()=>this.resolve()

);

window.addEventListener(

"load",

()=>this.resolve()

);

}

/* ======================================
   REGISTER ROUTE
====================================== */

add(path,callback){

this.routes[path]=callback;

return this;

}

/* ======================================
   404
====================================== */

setNotFound(callback){

this.notFound=callback;

return this;

}

/* ======================================
   GET CURRENT
====================================== */

getCurrentRoute(){

const hash=

location.hash.replace("#","");

return hash||"/";

}

/* ======================================
   NAVIGATE
====================================== */

go(path){

location.hash=path;

}

/* ======================================
   BEFORE HOOK
====================================== */

beforeEach(callback){

this.beforeHooks.push(callback);

}

/* ======================================
   AFTER HOOK
====================================== */

afterEach(callback){

this.afterHooks.push(callback);

}

}

console.log("🧭 router.js Part 1 Loaded");
/* ==========================================================
   GameVerse Pro
   Production Router
   Part 2 / 4
========================================================== */

/* ======================================
   RESOLVE ROUTE
====================================== */

Router.prototype.resolve=async function(){

const path=this.getCurrentRoute();

this.currentRoute=path;

/* Before Hooks */

for(const hook of this.beforeHooks){

const result=await hook(path);

if(result===false){

return;

}

}

/* Route */

const route=this.routes[path];

if(route){

await route();

}else if(this.notFound){

await this.notFound(path);

}

/* After Hooks */

for(const hook of this.afterHooks){

await hook(path);

}

};

/* ======================================
   LOGIN GUARD
====================================== */

Router.prototype.requireAuth=function(){

this.beforeEach(()=>{

const token=

localStorage.getItem("token");

if(!token){

this.go("/login");

return false;

}

return true;

});

};

/* ======================================
   ACTIVE NAVIGATION
====================================== */

Router.prototype.updateActiveLinks=function(){

document

.querySelectorAll("[data-route]")

.forEach(link=>{

link.classList.toggle(

"active",

link.dataset.route===this.currentRoute

);

});

};

console.log("🧭 router.js Part 2 Loaded");
/* ==========================================================
   GameVerse Pro
   Production Router
   Part 3 / 4
========================================================== */

/* ======================================
   REMOVE ROUTE
====================================== */

Router.prototype.remove=function(path){

delete this.routes[path];

return this;

};

/* ======================================
   HAS ROUTE
====================================== */

Router.prototype.has=function(path){

return Object.prototype.hasOwnProperty.call(

this.routes,

path

);

};

/* ======================================
   REDIRECT
====================================== */

Router.prototype.redirect=function(from,to){

this.add(from,()=>{

this.go(to);

});

return this;

};

/* ======================================
   BACK
====================================== */

Router.prototype.back=function(){

window.history.back();

};

/* ======================================
   FORWARD
====================================== */

Router.prototype.forward=function(){

window.history.forward();

};

/* ======================================
   RELOAD
====================================== */

Router.prototype.reload=function(){

this.resolve();

};

/* ======================================
   CURRENT ROUTE
====================================== */

Router.prototype.current=function(){

return this.currentRoute;

};

console.log("🧭 router.js Part 3 Loaded");
/* ==========================================================
   GameVerse Pro
   Production Router
   Part 4 / 4
========================================================== */

/* ======================================
   GLOBAL INSTANCE
====================================== */

const router = new Router();

/* ======================================
   DEFAULT ROUTES
====================================== */

router

.add("/", () => {

console.log("🏠 Home");

})

.add("/leaderboard", () => {

if(typeof loadLeaderboard==="function"){

loadLeaderboard();

}

})

.add("/profile", () => {

if(typeof loadProfile==="function"){

loadProfile();

}

})

.setNotFound(() => {

console.warn("404 Route Not Found");

if(typeof notifyError==="function"){

notifyError("Page not found");

}

});

/* ======================================
   GLOBAL AUTH GUARDS
====================================== */

router.requireAuth("/profile");

/* ======================================
   GLOBAL AFTER HOOK
====================================== */

router.afterEach((route)=>{

console.log("Navigated:",route);

});

/* ======================================
   FREEZE ROUTER API
====================================== */

Object.freeze(Router.prototype);

/* ======================================
   MODULE INFO
====================================== */

console.table({

module:"Router",

version:"1.0.0",

routes:Object.keys(router.routes).length,

status:"Production Ready"

});

console.log("🧭 router.js Loaded");
