/* ======================================
   GameVerse Pro - Survival Game
====================================== */

GameBridge.init("survival");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const healthEl = document.getElementById("health");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("gameStatus");

let running = false;
let score = 0;
let health = 100;
let seconds = 0;

const player = {
    x: 450,
    y: 250,
    size: 30,
    speed: 5
};

const keys = {};
const enemies = [];

/* ==========================
   Keyboard
========================== */

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

/* ==========================
   Player
========================== */

function updatePlayer() {

    if(keys["w"] || keys["arrowup"])
        player.y -= player.speed;

    if(keys["s"] || keys["arrowdown"])
        player.y += player.speed;

    if(keys["a"] || keys["arrowleft"])
        player.x -= player.speed;

    if(keys["d"] || keys["arrowright"])
        player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width-player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height-player.size, player.y));

}

/* ==========================
   Spawn Enemy
========================== */

function spawnEnemy(){

    enemies.push({

        x:Math.random()*canvas.width,
        y:0,
        size:28,
        speed:2+Math.random()*2

    });

}

/* ==========================
   Enemy AI
========================== */

function updateEnemies(){

    enemies.forEach(enemy=>{

        const dx=player.x-enemy.x;
        const dy=player.y-enemy.y;

        const dist=Math.sqrt(dx*dx+dy*dy);

        enemy.x+=dx/dist*enemy.speed;
        enemy.y+=dy/dist*enemy.speed;

    });

}

/* ==========================
   Attack
========================== */

canvas.addEventListener("click",()=>{

    enemies.forEach((enemy,index)=>{

        const dx=enemy.x-player.x;
        const dy=enemy.y-player.y;

        const dist=Math.sqrt(dx*dx+dy*dy);

        if(dist<80){

            enemies.splice(index,1);

            score+=100;

            GameBridge.addScore(100);

        }

    });

});

/* ==========================
   Collision
========================== */

function checkCollision(){

    enemies.forEach(enemy=>{

        const dx=enemy.x-player.x;
        const dy=enemy.y-player.y;

        const dist=Math.sqrt(dx*dx+dy*dy);

        if(dist<25){

            health--;

        }

    });

    if(health<=0){

        endGame();

    }

}

/* ==========================
   Draw
========================== */

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#2563EB";

    ctx.fillRect(
        player.x,
        player.y,
        player.size,
        player.size
    );

    ctx.fillStyle="#DC2626";

    enemies.forEach(enemy=>{

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.size/2,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

/* ==========================
   Timer
========================== */

function updateTimer(){

    seconds++;

    const m=Math.floor(seconds/60);

    const s=seconds%60;

    timeEl.innerHTML=

    String(m).padStart(2,"0")

    +

    ":"

    +

    String(s).padStart(2,"0");

}

/* ==========================
   Loop
========================== */

function loop(){

    if(!running) return;

    updatePlayer();

    updateEnemies();

    checkCollision();

    draw();

    healthEl.innerHTML=health;

    scoreEl.innerHTML=score;

    requestAnimationFrame(loop);

}

/* ==========================
   Start
========================== */

function startGame(){

    if(running) return;

    running=true;

    statusEl.innerHTML="Running";

    setInterval(spawnEnemy,1500);

    setInterval(updateTimer,1000);

    loop();

}

/* ==========================
   End
========================== */

function endGame(){

    running=false;

    statusEl.innerHTML="Game Over";

    GameBridge.gameOver(score,"lose");

    alert("Game Over!");

}

/* ==========================
   Buttons
========================== */

document.getElementById("startBtn").onclick=startGame;

document.getElementById("restartBtn").onclick=()=>{

    location.reload();

};

document.getElementById("exitBtn").onclick=()=>{

    GameBridge.exit();

};

console.log("✅ Survival Loaded");
