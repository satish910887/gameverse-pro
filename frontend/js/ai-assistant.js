/* ==========================================================
   GAMEVERSE PRO
   AI ASSISTANT
   PART 1 / 4
========================================================== */

class AIAssistant{

constructor(){

this.isOpen=false;

this.messages=[];

this.init();

}

/* ======================================
   INIT
====================================== */

init(){

this.createUI();

this.bindEvents();

}

/* ======================================
   CREATE UI
====================================== */

createUI(){

const assistant=document.createElement("div");

assistant.id="aiAssistantWindow";

assistant.innerHTML=`

<div id="aiHeader">

🤖 AI Assistant

<span id="aiClose">✖</span>

</div>

<div id="aiMessages"></div>

<div id="aiInputBox">

<input

id="aiInput"

type="text"

placeholder="Ask anything...">

<button id="aiSend">

Send

</button>

</div>

`;

assistant.style.display="none";

document.body.appendChild(assistant);

}

/* ======================================
   EVENTS
====================================== */

bindEvents(){

const button=

document.getElementById("aiButton");

if(button){

button.addEventListener(

"click",

()=>this.toggle()

);

}

document.addEventListener(

"click",

e=>{

if(e.target.id==="aiClose"){

this.close();

}

if(e.target.id==="aiSend"){

this.sendMessage();

}

}

);

}

/* ======================================
   OPEN / CLOSE
====================================== */

toggle(){

this.isOpen

?

this.close()

:

this.open();

}

open(){

this.isOpen=true;

document.getElementById(

"aiAssistantWindow"

).style.display="block";

}

close(){

this.isOpen=false;

document.getElementById(

"aiAssistantWindow"

).style.display="none";

}

}

const aiAssistant=

new AIAssistant();

console.log("🤖 AI Assistant Part 1 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   AI ASSISTANT
   PART 2 / 4
========================================================== */

/* ======================================
   SEND MESSAGE
====================================== */

AIAssistant.prototype.sendMessage=function(){

const input=

document.getElementById("aiInput");

if(!input)return;

const text=

input.value.trim();

if(!text)return;

this.addMessage(

"You",

text

);

input.value="";

this.generateReply(text);

};

/* ======================================
   ADD MESSAGE
====================================== */

AIAssistant.prototype.addMessage=function(

sender,

message

){

const box=

document.getElementById(

"aiMessages"

);

if(!box)return;

const msg=

document.createElement("div");

msg.className="ai-message";

msg.innerHTML=

`<b>${sender}:</b> ${message}`;

box.appendChild(msg);

box.scrollTop=

box.scrollHeight;

};

/* ======================================
   AI RESPONSE
====================================== */

AIAssistant.prototype.generateReply=function(text){

let reply=

"I can help you with GameVerse Pro.";

const q=

text.toLowerCase();

if(q.includes("leaderboard")){

reply="Open the Leaderboard section to view the latest rankings.";

}

else if(q.includes("coin")){

reply="Play games and claim your daily reward to earn coins.";

}

else if(q.includes("profile")){

reply="Open your profile to check your level, XP and rewards.";

}

else if(q.includes("game")){

reply="Choose any game card and press Play to start.";

}

setTimeout(()=>{

this.addMessage(

"AI",

reply

);

if(typeof playNotificationSound==="function"){

playNotificationSound();

}

},600);

};

/* ======================================
   ENTER KEY
====================================== */

document.addEventListener(

"keydown",

e=>{

if(

e.key==="Enter" &&

document.activeElement.id==="aiInput"

){

aiAssistant.sendMessage();

}

});

console.log("🤖 AI Assistant Part 2 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   AI ASSISTANT
   PART 3 / 4
========================================================== */

/* ======================================
   QUICK COMMANDS
====================================== */

AIAssistant.prototype.executeCommand=function(text){

const cmd=text.toLowerCase();

if(cmd==="help"){

return "Commands: help, profile, leaderboard, games, reward, coins";

}

if(cmd==="profile"){

if(typeof loadProfile==="function"){

loadProfile();

}

return "Profile refreshed.";

}

if(cmd==="leaderboard"){

if(typeof loadLeaderboard==="function"){

loadLeaderboard();

}

return "Leaderboard updated.";

}

if(cmd==="games"){

scrollToGames();

return "Opening Games section.";

}

if(cmd==="reward"){

const btn=

document.getElementById(

"dailyRewardBtn"

);

if(btn){

btn.click();

}

return "Daily reward requested.";

}

if(cmd==="coins"){

return "Earn coins by playing games, winning matches and claiming daily rewards.";

}

return null;

};

/* ======================================
   SMART RESPONSE
====================================== */

const oldGenerateReply=

AIAssistant.prototype.generateReply;

AIAssistant.prototype.generateReply=function(text){

const command=

this.executeCommand(text);

if(command){

setTimeout(()=>{

this.addMessage(

"AI",

command

);

},300);

return;

}

oldGenerateReply.call(

this,

text

);

};

/* ======================================
   WELCOME MESSAGE
====================================== */

window.addEventListener(

"load",

()=>{

setTimeout(()=>{

aiAssistant.addMessage(

"AI",

"Welcome to GameVerse Pro! Type 'help' to see available commands."

);

},800);

});

console.log("🤖 AI Assistant Part 3 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   AI ASSISTANT
   PART 4 / 4
========================================================== */

/* ======================================
   CHAT HISTORY
====================================== */

AIAssistant.prototype.saveHistory=function(){

localStorage.setItem(

"aiChatHistory",

JSON.stringify(this.messages)

);

};

AIAssistant.prototype.loadHistory=function(){

const history=

JSON.parse(

localStorage.getItem("aiChatHistory")||"[]"

);

this.messages=history;

history.forEach(msg=>{

this.addMessage(

msg.sender,

msg.text

);

});

};

/* ======================================
   OVERRIDE MESSAGE
====================================== */

const oldAddMessage=

AIAssistant.prototype.addMessage;

AIAssistant.prototype.addMessage=function(sender,text){

this.messages.push({

sender,

text

});

oldAddMessage.call(

this,

sender,

text

);

this.saveHistory();

};

/* ======================================
   CLEAR CHAT
====================================== */

AIAssistant.prototype.clearChat=function(){

this.messages=[];

localStorage.removeItem(

"aiChatHistory"

);

const box=

document.getElementById(

"aiMessages"

);

if(box){

box.innerHTML="";

}

};

/* ======================================
   MINIMIZE
====================================== */

AIAssistant.prototype.minimize=function(){

this.close();

};

/* ======================================
   INITIALIZE
====================================== */

window.addEventListener("load",()=>{

aiAssistant.loadHistory();

});

/* ======================================
   MODULE INFO
====================================== */

const AI_MODULE={

module:"AI Assistant",

version:"2.0.0",

status:"Production Ready"

};

console.table(AI_MODULE);

console.log("🤖 ai-assistant.js Loaded");
