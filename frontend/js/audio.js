/* ==========================================================
   GAMEVERSE PRO
   AUDIO SYSTEM
   PART 1 / 4
========================================================== */

class AudioManager{

constructor(){

this.enabled=true;

this.volume=.5;

this.music=null;

this.sounds={};

this.initialized=false;

this.loadSounds();

}

/* ======================================
   LOAD
====================================== */

loadSounds(){

this.music=new Audio(

"assets/audio/background.mp3"

);

this.music.loop=true;

this.music.volume=this.volume;

this.music.preload="auto";

this.sounds.click=

new Audio(

"assets/audio/click.mp3"

);

this.sounds.win=

new Audio(

"assets/audio/win.mp3"

);

this.sounds.lose=

new Audio(

"assets/audio/lose.mp3"

);

this.sounds.coin=

new Audio(

"assets/audio/coin.mp3"

);

this.sounds.notification=

new Audio(

"assets/audio/notification.mp3"

);

Object.values(

this.sounds

).forEach(sound=>{

sound.volume=this.volume;

sound.preload="auto";

});

this.initialized=true;

}

/* ======================================
   PLAY EFFECT
====================================== */

play(name){

if(!this.enabled)return;

const sound=

this.sounds[name];

if(!sound)return;

sound.currentTime=0;

sound.play().catch(()=>{});

}

/* ======================================
   MUSIC
====================================== */

playMusic(){

if(

!this.enabled||

!this.music

)return;

this.music.play()

.catch(()=>{});

}

stopMusic(){

if(!this.music)return;

this.music.pause();

this.music.currentTime=0;

}

  }
/* ==========================================================
   GAMEVERSE PRO
   AUDIO SYSTEM
   PART 2 / 4
========================================================== */

/* ======================================
   VOLUME
====================================== */

setVolume(value){

this.volume=value;

if(this.music){

this.music.volume=value;

}

Object.values(

this.sounds

).forEach(sound=>{

sound.volume=value;

});

localStorage.setItem(

"audioVolume",

value

);

}

/* ======================================
   MUTE
====================================== */

toggle(){

this.enabled=!this.enabled;

localStorage.setItem(

"audioEnabled",

this.enabled

);

if(this.enabled){

this.playMusic();

}else{

this.stopMusic();

}

return this.enabled;

}

/* ======================================
   RESTORE
====================================== */

restoreSettings(){

const enabled=

localStorage.getItem(

"audioEnabled"

);

const volume=

localStorage.getItem(

"audioVolume"

);

if(enabled!==null){

this.enabled=

enabled==="true";

}

if(volume!==null){

this.setVolume(

parseFloat(volume)

);

}

if(this.enabled){

this.playMusic();

}

}

/* ======================================
   FADE IN
====================================== */

fadeIn(){

if(!this.music)return;

this.music.volume=0;

this.playMusic();

let v=0;

const timer=

setInterval(()=>{

v+=0.05;

if(v>=this.volume){

v=this.volume;

clearInterval(timer);

}

this.music.volume=v;

},100);

}

/* ======================================
   FADE OUT
====================================== */

fadeOut(){

if(!this.music)return;

let v=this.music.volume;

const timer=

setInterval(()=>{

v-=0.05;

if(v<=0){

v=0;

clearInterval(timer);

this.stopMusic();

}

this.music.volume=v;

},100);

}
/* ==========================================================
   GAMEVERSE PRO
   AUDIO SYSTEM
   PART 3 / 4
========================================================== */

const audioManager=new AudioManager();

audioManager.restoreSettings();

/* ======================================
   CLICK
====================================== */

function playClickSound(){

audioManager.play("click");

}

/* ======================================
   WIN
====================================== */

function playWinSound(){

audioManager.play("win");

}

/* ======================================
   LOSE
====================================== */

function playLoseSound(){

audioManager.play("lose");

}

/* ======================================
   COIN
====================================== */

function playCoinSound(){

audioManager.play("coin");

}

/* ======================================
   NOTIFICATION
====================================== */

function playNotificationSound(){

audioManager.play("notification");

}

/* ======================================
   AUTO CLICK SOUND
====================================== */

document.addEventListener("click",e=>{

if(

e.target.closest("button")||

e.target.closest(".game-card")

){

playClickSound();

}

});

/* ======================================
   GAME EVENTS
====================================== */

window.addEventListener("focus",()=>{

if(audioManager.enabled){

audioManager.fadeIn();

}

});

window.addEventListener("blur",()=>{

audioManager.fadeOut();

});

console.log("🎵 Audio Part 3 Loaded");
/* ==========================================================
   GAMEVERSE PRO
   AUDIO SYSTEM
   PART 4 / 4
========================================================== */

/* ======================================
   SHORTCUT
====================================== */

document.addEventListener("keydown",e=>{

if(e.key.toLowerCase()==="m"){

audioManager.toggle();

showToast(

audioManager.enabled

?

"🔊 Sound Enabled"

:

"🔇 Sound Muted"

);

}

});

/* ======================================
   GAME MUSIC
====================================== */

function startGameMusic(){

audioManager.fadeIn();

}

function stopGameMusic(){

audioManager.fadeOut();

}

/* ======================================
   PRELOAD
====================================== */

function preloadSounds(){

Object.values(

audioManager.sounds

).forEach(sound=>{

sound.load();

});

if(audioManager.music){

audioManager.music.load();

}

}

/* ======================================
   INIT
====================================== */

window.addEventListener("load",()=>{

preloadSounds();

audioManager.restoreSettings();

});

/* ======================================
   MODULE INFO
====================================== */

const AUDIO_MODULE={

module:"Audio",

version:"2.0.0",

status:"Production Ready"

};

console.table(AUDIO_MODULE);

console.log("✅ audio.js Loaded");
