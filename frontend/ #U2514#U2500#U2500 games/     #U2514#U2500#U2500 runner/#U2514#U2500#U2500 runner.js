/* ======================================
   GameVerse Pro - Endless Runner
====================================== */

GameBridge.init("runner");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const coinEl = document.getElementById("coins");
const distanceEl = document.getElementById("distance");
const statusEl = document.getElementById("gameStatus");

let score = 0;
let coins = 0;
let distance = 0;

let speed = 6;
let running = false;

const player = {
    x: 80,
    y: 330,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false
};

const gravity = 0.8;
const jumpForce = -14;

const obstacles = [];
const coinList = [];

/* ==========================
   Spawn
========================== */

function spawnObstacle(){

    obstacles.push({
        x: canvas.width,
        y: 340,
        width: 30,
        height: 60
    });

}

function spawnCoin(){

    coinList.push({
        x: canvas.width,
        y: 250,
        size: 18
    });

}

/* ==========================
   Draw
========================== */

function drawPlayer(){

    ctx.fillStyle="#2563EB";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

}

function drawObstacles(){

    ctx.fillStyle="#DC2626";

    obstacles.forEach(o=>{

        ctx.fillRect(
            o.x,
            o.y,
            o.width,
            o.height
        );

    });

}

function drawCoins(){

    ctx.fillStyle="#FACC15";

    coinList.forEach(c=>{

        ctx.beginPath();

        ctx.arc(
            c.x,
            c.y,
            c.size/2,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

/* ==========================
   Physics
========================== */

function updatePlayer(){

    player.velocityY += gravity;

    player.y += player.velocityY;

    if(player.y>=330){

        player.y=330;

        player.velocityY=0;

        player.jumping=false;

    }

}

/* ==========================
   Update Objects
========================== */

function updateObjects(){

    obstacles.forEach(o=>{

        o.x -= speed;

    });

    coinList.forEach(c=>{

        c.x -= speed;

    });

}

/* ==========================
   Collision
========================== */

function checkCollision(){

    obstacles.forEach(o=>{

        if(

            player.x < o.x + o.width &&

            player.x + player.width > o.x &&

            player.y < o.y + o.height &&

            player.y + player.height > o.y

        ){

            endGame();

        }

    });

    coinList.forEach((c,index)=>{

        if(

            player.x < c.x + c.size &&

            player.x + player.width > c.x &&

            player.y < c.y + c.size &&

            player.y + player.height > c.y

        ){

            coinList.splice(index,1);

            coins++;

            score += 100;

            GameBridge.addScore(100);

        }

    });

}

/* ==========================
   Game Loop
========================== */

function gameLoop(){

    if(!running) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    updatePlayer();

    updateObjects();

    checkCollision();

    drawPlayer();

    drawObstacles();

    drawCoins();

    score++;

    distance++;

    if(score%500===0){

        speed++;

    }

    scoreEl.innerHTML=score;
    coinEl.innerHTML=coins;
    distanceEl.innerHTML=distance+"m";

    requestAnimationFrame(gameLoop);

}

/* ==========================
   Jump
========================== */

function jump(){

    if(player.jumping) return;

    player.velocityY = jumpForce;

    player.jumping = true;

}

window.addEventListener("keydown",(e)=>{

    if(e.code==="Space"||e.code==="ArrowUp"){

        jump();

    }

});

canvas.addEventListener("click",jump);

/* ==========================
   Game Start
========================== */

function startGame(){

    if(running) return;

    running=true;

    statusEl.innerHTML="Running";

    setInterval(spawnObstacle,1800);

    setInterval(spawnCoin,2500);

    gameLoop();

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

console.log("✅ Runner Game Loaded");
