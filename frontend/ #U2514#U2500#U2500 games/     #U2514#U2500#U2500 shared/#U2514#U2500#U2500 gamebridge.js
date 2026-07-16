/* ======================================
   GameVerse Pro - Game Bridge
   Shared by All Games
====================================== */

const GameBridge = {

    gameName: null,

    startTime: Date.now(),

    score: 0,

    result: "win",

    init(gameName) {

        this.gameName = gameName;

        this.startTime = Date.now();

        console.log("🎮 Game Started:", gameName);

    },

    setScore(score) {

        this.score = Number(score) || 0;

    },

    addScore(points) {

        this.score += Number(points);

    },

    getScore() {

        return this.score;

    },

    pause() {

        window.parent.postMessage({

            type: "GAME_PAUSE",

            game: this.gameName

        }, "*");

    },

    resume() {

        window.parent.postMessage({

            type: "GAME_RESUME",

            game: this.gameName

        }, "*");

    },

    gameOver(score = this.score, result = "win") {

        window.parent.postMessage({

            type: "GAME_OVER",

            game: this.gameName,

            score,

            result,

            duration:
                Math.floor(
                    (Date.now() - this.startTime) / 1000
                )

        }, "*");

    },

    exit() {

        window.parent.postMessage({

            type: "GAME_EXIT",

            game: this.gameName

        }, "*");

    },

    save(data = {}) {

        window.parent.postMessage({

            type: "GAME_SAVE",

            game: this.gameName,

            data

        }, "*");

    },

    achievement(title) {

        window.parent.postMessage({

            type: "ACHIEVEMENT",

            title

        }, "*");

    }

};

// Listen Parent Events

window.addEventListener("message", (event) => {

    if (!event.data) return;

    switch (event.data.type) {

        case "PAUSE":

            console.log("⏸ Game Paused");

            break;

        case "RESUME":

            console.log("▶ Game Resumed");

            break;

        case "EXIT":

            console.log("❌ Exit Requested");

            break;

    }

});

console.log("✅ gamebridge.js Loaded");
