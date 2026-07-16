/* ==========================================================
   GameVerse Pro
   Production Storage Manager
   Part 1 / 4
========================================================== */

class StorageManager{

constructor(options={}){

this.prefix=options.prefix||"gvp_";

this.storage=options.storage||localStorage;

this.version="1.0.0";

}

/* ======================================
   CREATE KEY
====================================== */

createKey(key){

return this.prefix+key;

}

/* ======================================
   SERIALIZE
====================================== */

serialize(value){

return JSON.stringify(value);

}

/* ======================================
   DESERIALIZE
====================================== */

deserialize(value){

try{

return JSON.parse(value);

}

catch{

return value;

}

}

/* ======================================
   SAVE
====================================== */

set(key,value,ttl=null){

const payload={

value,

createdAt:Date.now(),

expiresAt:

ttl

?

Date.now()+ttl

:

null

};

try{

this.storage.setItem(

this.createKey(key),

this.serialize(payload)

);

return true;

}

catch(err){

console.error(

"Storage Save Error",

err

);

return false;

}

}

/* ======================================
   GET
====================================== */

get(key,defaultValue=null){

try{

const raw=

this.storage.getItem(

this.createKey(key)

);

if(!raw){

return defaultValue;

}

const payload=

this.deserialize(raw);

if(

payload.expiresAt &&

Date.now()>payload.expiresAt

){

this.remove(key);

return defaultValue;

}

return payload.value;

}

catch(err){

console.error(

"Storage Read Error",

err

);

return defaultValue;

}

}

/* ======================================
   REMOVE
====================================== */

remove(key){

this.storage.removeItem(

this.createKey(key)

);

}

}

console.log("💾 Storage Manager Part 1 Loaded");
/* ==========================================================
   GameVerse Pro
   Production Storage Manager
   Part 2 / 4
========================================================== */

/* ======================================
   EXISTS
====================================== */

has(key){

return this.storage.getItem(

this.createKey(key)

)!==null;

}

/* ======================================
   CLEAR GAMEVERSE DATA
====================================== */

clear(){

const keys=[];

for(

let i=0;

i<this.storage.length;

i++

){

const key=

this.storage.key(i);

if(

key &&

key.startsWith(this.prefix)

){

keys.push(key);

}

}

keys.forEach(key=>{

this.storage.removeItem(key);

});

}

/* ======================================
   SAVE MULTIPLE
====================================== */

setMany(data={}){

Object.entries(data).forEach(

([key,value])=>{

this.set(key,value);

}

);

}

/* ======================================
   GET MULTIPLE
====================================== */

getMany(keys=[]){

const result={};

keys.forEach(key=>{

result[key]=this.get(key);

});

return result;

}

/* ======================================
   TOKEN HELPERS
====================================== */

saveToken(token){

return this.set(

"token",

token

);

}

getToken(){

return this.get("token");

}

removeToken(){

this.remove("token");

}

/* ======================================
   USER HELPERS
====================================== */

saveUser(user){

return this.set(

"user",

user

);

}

getUser(){

return this.get("user");

}

removeUser(){

this.remove("user");

}
/* ==========================================================
   GameVerse Pro
   Production Storage Manager
   Part 3 / 4
========================================================== */

/* ======================================
   THEME
====================================== */

saveTheme(theme){

return this.set("theme",theme);

}

getTheme(){

return this.get("theme","dark");

}

/* ======================================
   AUDIO
====================================== */

saveAudio(enabled){

return this.set("audio",enabled);

}

getAudio(){

return this.get("audio",true);

}

saveVolume(volume){

return this.set("volume",volume);

}

getVolume(){

return this.get("volume",0.5);

}

/* ======================================
   AI CHAT
====================================== */

saveChatHistory(messages){

return this.set("chatHistory",messages);

}

getChatHistory(){

return this.get("chatHistory",[]);

}

/* ======================================
   EXPORT
====================================== */

export(){

const data={};

for(let i=0;i<this.storage.length;i++){

const key=this.storage.key(i);

if(key&&key.startsWith(this.prefix)){

data[key]=this.storage.getItem(key);

}

}

return data;

}

/* ======================================
   IMPORT
====================================== */

import(data={}){

Object.entries(data).forEach(([key,value])=>{

this.storage.setItem(key,value);

});

  }
/* ==========================================================
   GameVerse Pro
   Production Storage Manager
   Part 4 / 4
========================================================== */

/* ======================================
   STORAGE SIZE
====================================== */

getSize(){

let bytes=0;

for(let i=0;i<this.storage.length;i++){

const key=this.storage.key(i);

if(key&&key.startsWith(this.prefix)){

const value=this.storage.getItem(key)||"";

bytes+=key.length+value.length;

}

}

return{

bytes,

kb:(bytes/1024).toFixed(2),

mb:(bytes/1024/1024).toFixed(2)

};

}

/* ======================================
   SESSION STORAGE
====================================== */

session(){

return new StorageManager({

prefix:this.prefix,

storage:sessionStorage

});

}

/* ======================================
   RESET
====================================== */

reset(){

this.clear();

console.log("🗑 GameVerse storage cleared.");

}

/* ======================================
   MODULE INFO
====================================== */

info(){

return{

name:"Storage Manager",

version:this.version,

prefix:this.prefix,

items:Object.keys(this.export()).length,

size:this.getSize()

};

}

}

/* ======================================
   GLOBAL INSTANCE
====================================== */

const storage=new StorageManager();

/* ======================================
   FREEZE PROTOTYPE
====================================== */

Object.freeze(StorageManager.prototype);

/* ======================================
   STARTUP
====================================== */

console.table(storage.info());

console.log("💾 storage.js Loaded");
