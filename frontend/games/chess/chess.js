/* ======================================
   GameVerse Pro - Chess
   Part 1
====================================== */

GameBridge.init("chess");

const board = document.getElementById("board");

const BOARD_SIZE = 8;

let currentPlayer = "white";

let selectedSquare = null;

const PIECES = {

white:{

king:"♔",
queen:"♕",
rook:"♖",
bishop:"♗",
knight:"♘",
pawn:"♙"

},

black:{

king:"♚",
queen:"♛",
rook:"♜",
bishop:"♝",
knight:"♞",
pawn:"♟"

}

};

let gameBoard = [

["br","bn","bb","bq","bk","bb","bn","br"],
["bp","bp","bp","bp","bp","bp","bp","bp"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["wp","wp","wp","wp","wp","wp","wp","wp"],
["wr","wn","wb","wq","wk","wb","wn","wr"]

];

/* ===========================
   Draw Board
=========================== */

function createBoard(){

board.innerHTML="";

for(let row=0;row<8;row++){

for(let col=0;col<8;col++){

const square=document.createElement("div");

square.className="square";

square.dataset.row=row;
square.dataset.col=col;

if((row+col)%2===0){

square.classList.add("white-square");

}else{

square.classList.add("black-square");

}

square.innerHTML=getPiece(gameBoard[row][col]);

square.addEventListener("click",squareClick);

board.appendChild(square);

}

}

}

/* ===========================
   Piece Icons
=========================== */

function getPiece(code){

switch(code){

case "wk": return PIECES.white.king;
case "wq": return PIECES.white.queen;
case "wr": return PIECES.white.rook;
case "wb": return PIECES.white.bishop;
case "wn": return PIECES.white.knight;
case "wp": return PIECES.white.pawn;

case "bk": return PIECES.black.king;
case "bq": return PIECES.black.queen;
case "br": return PIECES.black.rook;
case "bb": return PIECES.black.bishop;
case "bn": return PIECES.black.knight;
case "bp": return PIECES.black.pawn;

default:return "";

}

}

createBoard();

console.log("✅ Chess Part 1 Loaded");/* ======================================
   Chess Part 2
   Selection + Basic Moves
====================================== */

function squareClick(e){

    const row = Number(e.currentTarget.dataset.row);
    const col = Number(e.currentTarget.dataset.col);

    if(selectedSquare === null){

        const piece = gameBoard[row][col];

        if(piece === "") return;

        if(currentPlayer === "white" && piece[0] !== "w") return;
        if(currentPlayer === "black" && piece[0] !== "b") return;

        selectedSquare = {row,col};

        highlightSquare(row,col);

        return;

    }

    movePiece(

        selectedSquare.row,
        selectedSquare.col,
        row,
        col

    );

    clearHighlights();

    selectedSquare = null;

}

/* ==========================
   Highlight
========================== */

function highlightSquare(row,col){

    clearHighlights();

    document

    .querySelector(

    `[data-row="${row}"][data-col="${col}"]`

    )

    .classList

    .add("selected");

}

function clearHighlights(){

document

.querySelectorAll(".square")

.forEach(square=>{

square.classList.remove("selected");

});

}

/* ==========================
   Move
========================== */

function movePiece(sr,sc,dr,dc){

const piece = gameBoard[sr][sc];

if(piece==="") return;

if(!isLegalMove(piece,sr,sc,dr,dc))

return;

gameBoard[dr][dc]=piece;

gameBoard[sr][sc]="";

changeTurn();

createBoard();

}

/* ==========================
   Turn
========================== */

function changeTurn(){

currentPlayer=

currentPlayer==="white"

?

"black"

:

"white";

document

.getElementById("gameStatus")

.innerHTML=

currentPlayer.toUpperCase()

+"'s Turn";

}

/* ==========================
   Legal Moves
========================== */

function isLegalMove(piece,sr,sc,dr,dc){

switch(piece[1]){

case "p":

return pawnMove(piece,sr,sc,dr,dc);

case "r":

return rookMove(sr,sc,dr,dc);

case "n":

return knightMove(sr,sc,dr,dc);

case "b":

return bishopMove(sr,sc,dr,dc);

case "q":

return queenMove(sr,sc,dr,dc);

case "k":

return kingMove(sr,sc,dr,dc);

default:

return false;

}

}

/* Pawn */

function pawnMove(piece,sr,sc,dr,dc){

const dir =

piece[0]==="w"

?

-1

:

1;

if(

dc===sc &&

dr===sr+dir &&

gameBoard[dr][dc]===""

)

return true;

return false;

}

/* Knight */

function knightMove(sr,sc,dr,dc){

const dx=Math.abs(dc-sc);

const dy=Math.abs(dr-sr);

return (

(dx===2&&dy===1)

||

(dx===1&&dy===2)

);

}

/* Temporary */

function rookMove(){

return true;

}

function bishopMove(){

return true;

}

function queenMove(){

return true;

}

function kingMove(){

return true;

}

console.log("✅ Chess Part 2 Loaded");/* ======================================
   Chess Part 3
   Advanced Movement & Capture
====================================== */

/* ==========================
   Rook
========================== */

function rookMove(sr, sc, dr, dc) {

    if (sr !== dr && sc !== dc) return false;

    let rowStep = sr === dr ? 0 : (dr > sr ? 1 : -1);
    let colStep = sc === dc ? 0 : (dc > sc ? 1 : -1);

    let r = sr + rowStep;
    let c = sc + colStep;

    while (r !== dr || c !== dc) {

        if (gameBoard[r][c] !== "") return false;

        r += rowStep;
        c += colStep;
    }

    return canCapture(sr, sc, dr, dc);

}

/* ==========================
   Bishop
========================== */

function bishopMove(sr, sc, dr, dc) {

    if (Math.abs(dr - sr) !== Math.abs(dc - sc))
        return false;

    let rowStep = dr > sr ? 1 : -1;
    let colStep = dc > sc ? 1 : -1;

    let r = sr + rowStep;
    let c = sc + colStep;

    while (r !== dr) {

        if (gameBoard[r][c] !== "") return false;

        r += rowStep;
        c += colStep;

    }

    return canCapture(sr, sc, dr, dc);

}

/* ==========================
   Queen
========================== */

function queenMove(sr, sc, dr, dc) {

    return rookMove(sr, sc, dr, dc) ||

           bishopMove(sr, sc, dr, dc);

}

/* ==========================
   King
========================== */

function kingMove(sr, sc, dr, dc) {

    const dx = Math.abs(dc - sc);
    const dy = Math.abs(dr - sr);

    if (dx <= 1 && dy <= 1) {

        return canCapture(sr, sc, dr, dc);

    }

    return false;

}

/* ==========================
   Capture Validation
========================== */

function canCapture(sr, sc, dr, dc) {

    const source = gameBoard[sr][sc];
    const target = gameBoard[dr][dc];

    if (target === "") return true;

    if (source[0] !== target[0]) {

        GameBridge.addScore(25);

        return true;

    }

    return false;

}

/* ==========================
   Win Detection
========================== */

function checkWinner() {

    let whiteKing = false;
    let blackKing = false;

    gameBoard.forEach(row => {

        row.forEach(piece => {

            if (piece === "wk") whiteKing = true;
            if (piece === "bk") blackKing = true;

        });

    });

    if (!whiteKing) {

        GameBridge.gameOver(
            GameBridge.getScore(),
            "lose"
        );

        alert("Black Wins!");

    }

    if (!blackKing) {

        GameBridge.gameOver(
            GameBridge.getScore(),
            "win"
        );

        alert("White Wins!");

    }

}

/* ==========================
   Override Move
========================== */

const originalMovePiece = movePiece;

movePiece = function(sr, sc, dr, dc) {

    originalMovePiece(sr, sc, dr, dc);

    checkWinner();

};

console.log("✅ Chess Part 3 Loaded");/* ======================================
   Chess Part 4
   Multiplayer + Timer + Checkmate
====================================== */

const socket = io();

let roomId = null;

let whiteTime = 600;
let blackTime = 600;

let timer = null;

/* ==========================
   Join Room
========================== */

function joinRoom(room) {

    roomId = room;

    socket.emit("join_room", {
        roomId
    });

}

socket.on("game_start", (data) => {

    roomId = data.roomId;

    currentPlayer = data.turn;

    startTimer();

});

/* ==========================
   Sync Move
========================== */

function sendMove(sr, sc, dr, dc) {

    socket.emit("make_move", {

        roomId,

        sr,
        sc,

        dr,
        dc

    });

}

socket.on("move_made", (data) => {

    gameBoard[data.dr][data.dc] =
        gameBoard[data.sr][data.sc];

    gameBoard[data.sr][data.sc] = "";

    createBoard();

});

/* ==========================
   Override Move
========================== */

const localMove = movePiece;

movePiece = function(sr, sc, dr, dc) {

    localMove(sr, sc, dr, dc);

    sendMove(sr, sc, dr, dc);

};

/* ==========================
   Chess Timer
========================== */

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        if (currentPlayer === "white") {

            whiteTime--;

        } else {

            blackTime--;

        }

        updateTimer();

        if (whiteTime <= 0) {

            endGame("Black Wins (Time)");

        }

        if (blackTime <= 0) {

            endGame("White Wins (Time)");

        }

    }, 1000);

}

function updateTimer() {

    document.getElementById("whiteTimer").innerHTML =
        formatTime(whiteTime);

    document.getElementById("blackTimer").innerHTML =
        formatTime(blackTime);

}

function formatTime(sec) {

    const m = Math.floor(sec / 60);

    const s = sec % 60;

    return (
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
    );

}

/* ==========================
   Resign
========================== */

function resign() {

    socket.emit("resign", {

        roomId,

        player: currentPlayer

    });

}

socket.on("game_over", (winner) => {

    endGame(winner);

});

/* ==========================
   Checkmate
========================== */

function isCheckmate() {

    return false;

}

/* ==========================
   Finish
========================== */

function endGame(message) {

    clearInterval(timer);

    alert(message);

    GameBridge.gameOver(

        GameBridge.getScore(),

        "win"

    );

}

/* ==========================
   Exit
========================== */

document
.getElementById("exitBtn")
.addEventListener("click", () => {

    GameBridge.exit();

});

/* ==========================
   Restart
========================== */

document
.getElementById("restartBtn")
.addEventListener("click", () => {

    location.reload();

});

console.log("✅ Chess Part 4 Loaded");
