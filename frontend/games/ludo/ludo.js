/* ======================================
   GameVerse Pro - Ludo
   Part 1
====================================== */

GameBridge.init("ludo");

const canvas = document.getElementById("boardCanvas");
const ctx = canvas.getContext("2d");

const BOARD_SIZE = 700;
const CELL_SIZE = BOARD_SIZE / 15;

let currentPlayer = 0;
let diceValue = 0;
let gameStarted = false;

/* ===========================
   Players
=========================== */

const players = [

{

name:"Red",

color:"#EF4444",

startIndex:0,

tokens:[

{x:1,y:1,step:-1,home:true},

{x:3,y:1,step:-1,home:true},

{x:1,y:3,step:-1,home:true},

{x:3,y:3,step:-1,home:true}

]

},

{

name:"Green",

color:"#22C55E",

startIndex:13,

tokens:[

{x:11,y:1,step:-1,home:true},

{x:13,y:1,step:-1,home:true},

{x:11,y:3,step:-1,home:true},

{x:13,y:3,step:-1,home:true}

]

},

{

name:"Yellow",

color:"#FACC15",

startIndex:26,

tokens:[

{x:11,y:11,step:-1,home:true},

{x:13,y:11,step:-1,home:true},

{x:11,y:13,step:-1,home:true},

{x:13,y:13,step:-1,home:true}

]

},

{

name:"Blue",

color:"#3B82F6",

startIndex:39,

tokens:[

{x:1,y:11,step:-1,home:true},

{x:3,y:11,step:-1,home:true},

{x:1,y:13,step:-1,home:true},

{x:3,y:13,step:-1,home:true}

]

}

];

/* ===========================
   Board Path
=========================== */

const PATH=[];

function createPath(){

// Top

for(let x=6;x>=0;x--)

PATH.push({x,y:0});

for(let y=1;y<=5;y++)

PATH.push({x:0,y});

for(let x=1;x<=5;x++)

PATH.push({x,y:6});

// Right

for(let y=5;y>=0;y--)

PATH.push({x:6,y});

for(let x=7;x<=14;x++)

PATH.push({x,y:0});

for(let y=1;y<=6;y++)

PATH.push({x:14,y});

// Bottom

for(let y=7;y<=14;y++)

PATH.push({x:14,y});

for(let x=13;x>=8;x--)

PATH.push({x,y:14});

for(let y=13;y>=8;y--)

PATH.push({x:8,y});

// Left

for(let x=7;x>=0;x--)

PATH.push({x,y:14});

for(let y=13;y>=8;y--)

PATH.push({x:0,y});

}

/* ===========================
   Draw Cell
=========================== */

function cell(x,y,color){

ctx.fillStyle=color;

ctx.fillRect(

x*CELL_SIZE,

y*CELL_SIZE,

CELL_SIZE,

CELL_SIZE

);

ctx.strokeStyle="#ddd";

ctx.strokeRect(

x*CELL_SIZE,

y*CELL_SIZE,

CELL_SIZE,

CELL_SIZE

);

}

/* ===========================
   Draw Board
=========================== */

function drawBoard(){

ctx.clearRect(0,0,700,700);

// Background

ctx.fillStyle="#fff";

ctx.fillRect(0,0,700,700);

// Red

ctx.fillStyle="#EF4444";

ctx.fillRect(0,0,280,280);

// Green

ctx.fillStyle="#22C55E";

ctx.fillRect(420,0,280,280);

// Yellow

ctx.fillStyle="#FACC15";

ctx.fillRect(420,420,280,280);

// Blue

ctx.fillStyle="#3B82F6";

ctx.fillRect(0,420,280,280);

}

/* ===========================
   Draw Tokens
=========================== */

function drawTokens(){

players.forEach(player=>{

ctx.fillStyle=player.color;

player.tokens.forEach(token=>{

ctx.beginPath();

ctx.arc(

token.x*CELL_SIZE+CELL_SIZE/2,

token.y*CELL_SIZE+CELL_SIZE/2,

18,

0,

Math.PI*2

);

ctx.fill();

});

});

}

/* ===========================
   Render
=========================== */

function render(){

drawBoard();

drawTokens();

requestAnimationFrame(render);

}

createPath();

render();

console.log("✅ Ludo Part 1 Loaded");/* ======================================
   Ludo Part 2
   Dice + Turn + Movement
====================================== */

const dice = document.getElementById("dice");
const rollBtn = document.getElementById("rollDiceBtn");

let canMove = false;
let selectedToken = null;

/* ===========================
   Roll Dice
=========================== */

rollBtn.addEventListener("click", () => {

    if (canMove) return;

    dice.classList.add("roll");

    setTimeout(() => {

        dice.classList.remove("roll");

        diceValue = Math.floor(Math.random() * 6) + 1;

        dice.innerHTML = diceValue;

        document.getElementById("turnText").innerHTML =
            players[currentPlayer].name +
            " rolled " +
            diceValue;

        canMove = true;

    }, 700);

});

/* ===========================
   Mouse Click
=========================== */

canvas.addEventListener("click", (e) => {

    if (!canMove) return;

    const rect = canvas.getBoundingClientRect();

    const mx = e.clientX - rect.left;

    const my = e.clientY - rect.top;

    const gx = Math.floor(mx / CELL_SIZE);

    const gy = Math.floor(my / CELL_SIZE);

    const player = players[currentPlayer];

    player.tokens.forEach(token => {

        if (token.x === gx && token.y === gy) {

            selectedToken = token;

            moveToken(token);

        }

    });

});

/* ===========================
   Move Token
=========================== */

function moveToken(token){

    if(diceValue!==6 && token.home){

        nextTurn();

        return;

    }

    if(token.home){

        token.home=false;

        token.step=0;

    }

    token.step+=diceValue;

    if(token.step>=PATH.length){

        token.step=PATH.length-1;

    }

    const pos=PATH[token.step];

    token.x=pos.x;

    token.y=pos.y;

    GameBridge.addScore(10);

    canMove=false;

    if(diceValue!==6){

        nextTurn();

    }

}

/* ===========================
   Turn
=========================== */

function nextTurn(){

    currentPlayer++;

    if(currentPlayer>=players.length){

        currentPlayer=0;

    }

    document.getElementById("turnText").innerHTML=

    players[currentPlayer].name+

    "'s Turn";

}

/* ===========================
   Update Score
=========================== */

function updateCoins(){

    document.getElementById("coinCount").innerHTML=

    GameBridge.getScore();

}

setInterval(updateCoins,200);

console.log("✅ Ludo Part 2 Loaded");/* ======================================
   Ludo Part 3
   Safe Zone + Kill + Win
====================================== */

const SAFE_ZONES = [
    0, 8, 13, 21, 26, 34, 39, 47
];

/* ===========================
   Safe Zone
=========================== */

function isSafe(step) {
    return SAFE_ZONES.includes(step);
}

/* ===========================
   Kill Opponent
=========================== */

function checkKill(activePlayer, token) {

    players.forEach((player, playerIndex) => {

        if (playerIndex === activePlayer) return;

        player.tokens.forEach(enemy => {

            if (enemy.home) return;

            if (
                enemy.step === token.step &&
                !isSafe(token.step)
            ) {

                enemy.home = true;
                enemy.step = -1;

                resetToken(enemy, playerIndex);

                GameBridge.addScore(50);

                showMessage(
                    players[activePlayer].name +
                    " captured a token!"
                );

            }

        });

    });

}

/* ===========================
   Reset Token
=========================== */

function resetToken(token, playerIndex) {

    const HOME = {

        0: [
            {x:1,y:1},
            {x:3,y:1},
            {x:1,y:3},
            {x:3,y:3}
        ],

        1: [
            {x:11,y:1},
            {x:13,y:1},
            {x:11,y:/* ======================================
   Ludo Part 4
   Socket.io Multiplayer
====================================== */

const socket = io();

let roomId = null;

/* ===========================
   Join Room
=========================== */

function joinRoom(room){

    roomId = room;

    socket.emit("join_room",{

        roomId

    });

}

socket.on("game_start",(data)=>{

    roomId = data.roomId;

    currentPlayer = data.turn;

    document.getElementById("turnText").innerHTML =
    "Game Started";

});

/* ===========================
   Roll Dice Sync
=========================== */

function syncDice(value){

    socket.emit("roll_dice",{

        roomId,

        value

    });

}

socket.on("dice_result",(data)=>{

    diceValue = data.value;

    dice.innerHTML = diceValue;

});

/* ===========================
   Move Sync
=========================== */

function syncMove(player,token,step){

    socket.emit("move_piece",{

        roomId,

        player,

        token,

        step

    });

}

socket.on("piece_moved",(data)=>{

    const t = players[data.player].tokens[data.token];

    t.step = data.step;

    const pos = PATH[data.step];

    t.x = pos.x;

    t.y = pos.y;

});

/* ===========================
   Turn Change
=========================== */

socket.on("
