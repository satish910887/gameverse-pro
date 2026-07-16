/* ======================================
   GameVerse Pro
   Lobby Socket
====================================== */

const waitingPlayers = [];

module.exports = (io) => {

    const lobby = io.of("/lobby");

    lobby.on("connection", (socket) => {

        console.log("🟢 Lobby Connected:", socket.id);

        /* ==========================
           Join Lobby
        ========================== */

        socket.on("join_lobby", (player) => {

            waitingPlayers.push({

                socketId: socket.id,

                userId: player.userId,

                username: player.username

            });

            if (waitingPlayers.length >= 2) {

                const player1 = waitingPlayers.shift();
                const player2 = waitingPlayers.shift();

                const roomId =
                    "room_" +
                    Date.now();

                const s1 =
                    lobby.sockets.get(player1.socketId);

                const s2 =
                    lobby.sockets.get(player2.socketId);

                if (s1 && s2) {

                    s1.join(roomId);
                    s2.join(roomId);

                    s1.emit("match_found", {

                        roomId,

                        opponent: player2.username,

                        color: "white"

                    });

                    s2.emit("match_found", {

                        roomId,

                        opponent: player1.username,

                        color: "black"

                    });

                }

            } else {

                socket.emit("waiting");

            }

        });

        /* ==========================
           Leave Lobby
        ========================== */

        socket.on("leave_lobby", () => {

            const index =
                waitingPlayers.findIndex(

                    p => p.socketId === socket.id

                );

            if (index !== -1) {

                waitingPlayers.splice(index, 1);

            }

        });

        /* ==========================
           Disconnect
        ========================== */

        socket.on("disconnect", () => {

            const index =
                waitingPlayers.findIndex(

                    p => p.socketId === socket.id

                );

            if (index !== -1) {

                waitingPlayers.splice(index, 1);

            }

            console.log("🔴 Lobby Disconnected:", socket.id);

        });

    });

};
