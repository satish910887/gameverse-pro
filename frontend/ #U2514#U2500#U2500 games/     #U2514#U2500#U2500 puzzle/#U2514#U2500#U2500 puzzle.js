/* ======================================
   GameVerse Pro - Puzzle Game
====================================== */

GameBridge.init("puzzle");

const board = document.getElementById("puzzleBoard");

const moveText = document.getElementById("moveCount");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

let tiles = [];
let moves = 0;
let score = 0;
let seconds = 0;
let timer;

/* ==========================
   Create Board
========================== */

function initGame(){

    tiles=[];

    for(let i=1;i<=15;i++){

        tiles.push(i);

    }

    tiles.push("");

    shuffle();

    render();

    moves=0;

    score=0;

    seconds=0;

    updateUI();

    clearInterval(timer);

    timer=setInterval(updateTimer,1000);

}

/* ==========================
   Shuffle
========================== */

function shuffle(){

    for(let i=tiles.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [tiles[i],tiles[j]]=[tiles[j],tiles[i]];

    }

}

/* ==========================
   Render
========================== */

function render(){

    board.innerHTML="";

    tiles.forEach((tile,index)=>{

        const div=document.createElement("div");

        div.className="tile";

        if(tile===""){

            div.classList.add("empty");

        }

        div.innerHTML=tile;

        div.onclick=()=>move(index);

        board.appendChild(div);

    });

}

/* ==========================
   Move Tile
========================== */

function move(index){

    const empty=tiles.indexOf("");

    const valid=[

        empty-1,

        empty+1,

        empty-4,

        empty+4

    ];

    if(!valid.includes(index))

    return;

    [tiles[index],tiles[empty]]

    =

    [tiles[empty],tiles[index]];

    moves++;

    score+=10;

    GameBridge.addScore(10);

    render();

    updateUI();

    checkWin();

}

/* ==========================
   Update
========================== */

function updateUI(){

    moveText.innerHTML=moves;

    scoreText.innerHTML=score;

}

/* ==========================
   Timer
========================== */

function updateTimer(){

    seconds++;

    const m=Math.floor(seconds/60);

    const s=seconds%60;

    timerText.innerHTML=

    String(m).padStart(2,"0")

    +

    ":"

    +

    String(s).padStart(2,"0");

}

/* ==========================
   Win
========================== */

function checkWin(){

    for(let i=0;i<15;i++){

        if(tiles[i]!==i+1)

        return;

    }

    clearInterval(timer);

    GameBridge.gameOver(

        score,

        "win"

    );

    alert("🎉 Puzzle Completed!");

}

/* ==========================
   Buttons
========================== */

document

.getElementById("shuffleBtn")

.onclick=initGame;

document

.getElementById("restartBtn")

.onclick=initGame;

document

.getElementById("exitBtn")

.onclick=()=>{

GameBridge.exit();

};

initGame();

console.log("✅ Puzzle Loaded");
