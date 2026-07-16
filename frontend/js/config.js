/* ==========================================================
   GameVerse Pro
   Configuration
   Part 1 / 4
========================================================== */

const CONFIG={

APP_NAME:"GameVerse Pro",

VERSION:"1.0.0",

API_BASE_URL:

window.location.hostname==="localhost"

?"http://localhost:5000/api"

:"/api",

SOCKET_URL:

window.location.hostname==="localhost"

?"http://localhost:5000"

:window.location.origin,

REQUEST_TIMEOUT:15000,

DEFAULT_LANGUAGE:"en",

DEFAULT_THEME:"dark",

ENABLE_SOUND:true,

ENABLE_NOTIFICATIONS:true,

ENABLE_AI_ASSISTANT:true,

ENABLE_ANTI_CHEAT:true

};

/* ======================================
   GET CONFIG
====================================== */

function getConfig(key){

return CONFIG[key];

}

/* ======================================
   UPDATE CONFIG
====================================== */

function setConfig(key,value){

CONFIG[key]=value;

}

console.log("⚙️ config.js Part 1 Loaded");
/* ==========================================================
   GameVerse Pro
   Configuration
   Part 2 / 4
========================================================== */

/* ======================================
   ENVIRONMENT
====================================== */

CONFIG.ENV=

window.location.hostname==="localhost"

?

"development"

:

"production";

/* ======================================
   STORAGE KEYS
====================================== */

CONFIG.STORAGE={

TOKEN:"token",

USER:"user",

THEME:"theme",

AUDIO:"audioEnabled",

AUDIO_VOLUME:"audioVolume",

AI_HISTORY:"aiChatHistory"

};

/* ======================================
   GAME SETTINGS
====================================== */

CONFIG.GAME={

MAX_SCORE:100000,

MAX_LEVEL:100,

XP_PER_LEVEL:1000,

AUTO_SAVE_INTERVAL:30000,

LEADERBOARD_REFRESH:30000

};

/* ======================================
   UI SETTINGS
====================================== */

CONFIG.UI={

MAX_NOTIFICATIONS:4,

DEFAULT_LANGUAGE:"en",

ANIMATION_SPEED:300

};

/* ======================================
   NETWORK
====================================== */

CONFIG.NETWORK={

RETRY_COUNT:3,

RETRY_DELAY:2000

};

console.log("⚙️ config.js Part 2 Loaded");
/* ==========================================================
   GameVerse Pro
   Configuration
   Part 2 / 4
========================================================== */

/* ======================================
   API ENDPOINTS
====================================== */

CONFIG.ENDPOINTS={

LOGIN:"/auth/login",

REGISTER:"/auth/register",

PROFILE:"/user/profile",

UPDATE_PROFILE:"/user/update",

LEADERBOARD:"/leaderboard",

MY_RANK:"/leaderboard/my-rank",

GAME_START:"/game/start",

GAME_END:"/game/end",

GAME_HISTORY:"/game/history",

DAILY_REWARD:"/user/daily-reward",

REPORT_CHEAT:"/game/report"

};

/* ======================================
   STORAGE KEYS
====================================== */

CONFIG.STORAGE={

TOKEN:"token",

USER:"user",

THEME:"theme",

AUDIO:"audioEnabled",

AUDIO_VOLUME:"audioVolume",

CHAT_HISTORY:"aiChatHistory",

NOTIFY_POSITION:"notifyPosition"

};

/* ======================================
   GAME SETTINGS
====================================== */

CONFIG.GAME={

MAX_SCORE:100000,

MIN_PLAY_TIME:5,

AUTO_SAVE_INTERVAL:30000,

LEADERBOARD_REFRESH:30000

};

console.log("⚙️ config.js Part 2 Loaded");
/* ==========================================================
   GameVerse Pro
   Configuration
   Part 3 / 4
========================================================== */

/* ======================================
   FEATURE FLAGS
====================================== */

CONFIG.FEATURES={

MULTIPLAYER:true,

CHAT:true,

VOICE_CHAT:false,

LEADERBOARD:true,

ACHIEVEMENTS:true,

DAILY_REWARDS:true,

AI_ASSISTANT:true,

ANTI_CHEAT:true,

NOTIFICATIONS:true,

ANALYTICS:false

};

/* ======================================
   ENVIRONMENT
====================================== */

CONFIG.ENV={

IS_LOCAL:

window.location.hostname==="localhost",

IS_PRODUCTION:

window.location.hostname!=="localhost",

ONLINE:

navigator.onLine

};

/* ======================================
   UPDATE ONLINE STATUS
====================================== */

window.addEventListener("online",()=>{

CONFIG.ENV.ONLINE=true;

});

window.addEventListener("offline",()=>{

CONFIG.ENV.ONLINE=false;

});

console.log("⚙️ config.js Part 3 Loaded");
/* ==========================================================
   GameVerse Pro
   Configuration
   Part 4 / 4
========================================================== */

/* ======================================
   INITIALIZE
====================================== */

function initConfig(){

if(!localStorage.getItem(CONFIG.STORAGE.THEME)){

localStorage.setItem(

CONFIG.STORAGE.THEME,

CONFIG.DEFAULT_THEME

);

}

if(localStorage.getItem(CONFIG.STORAGE.AUDIO)===null){

localStorage.setItem(

CONFIG.STORAGE.AUDIO,

String(CONFIG.ENABLE_SOUND)

);

}

}

/* ======================================
   GET FULL API URL
====================================== */

function getApiUrl(endpoint=""){

return CONFIG.API_BASE_URL+endpoint;

}

/* ======================================
   GET SOCKET URL
====================================== */

function getSocketUrl(){

return CONFIG.SOCKET_URL;

}

/* ======================================
   STARTUP
====================================== */

window.addEventListener("load",()=>{

initConfig();

console.log(

`${CONFIG.APP_NAME} v${CONFIG.VERSION} Started`

);

});

/* ======================================
   READ ONLY CONFIG
====================================== */

Object.freeze(CONFIG.ENDPOINTS);

Object.freeze(CONFIG.STORAGE);

Object.freeze(CONFIG.GAME);

Object.freeze(CONFIG.FEATURES);

/* CONFIG.ENV ko freeze nahi kiya gaya,
   kyunki ONLINE status runtime me change hota hai. */

/* ======================================
   MODULE INFO
====================================== */

const CONFIG_MODULE={

module:"Configuration",

version:CONFIG.VERSION,

environment:

CONFIG.ENV.IS_LOCAL

?

"Development"

:

"Production",

api:getApiUrl(),

socket:getSocketUrl(),

status:"Ready"

};

console.table(CONFIG_MODULE);

console.log("⚙️ config.js Loaded");
