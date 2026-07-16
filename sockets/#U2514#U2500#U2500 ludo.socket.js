/* ======================================
   GameVerse Pro
   Ludo Socket
====================================== */

module.exports = (io) => {

    const ludo = io.of("/ludo");

    ludo.on("connection", (socket) => {

        console.log("🟢 Ludo Connected:", socket.id);

        /* ==========================
           Join Room
        ========================== */

        socket.on("join_room", (data) => {

            socket.join(data.roomId);

            socket.to(data.roomId).emit("player_joined", {

                playerId: socket.id

            });

            ludo.to(data.roomId).emit("game_start", {

                roomId: data.roomId,

                turn: "red"

            });

        });

        /* ==========================
           Roll Dice
        ========================== */

        socket.on("roll_dice", (data) => {

            ludo.to(data.roomId).emit("dice_result", {

                value: data.value,

                player: socket.id

            });

        });

        /* ==========================
           Move Piece
        ========================== */

        socket.on("move_piece", (data) => {

            ludo.to(data.roomId).emit("piece_moved", {

                player: data.player,

                token: data.token,

                step: data.step

            });

        });

        /* ==========================
           Next Turn
        ========================== */

        socket.on("next_turn", (data) => {

            ludo.to(data.roomId).emit(

                "next_turn",

                data.player

            );

        });

        /* ==========================
           Game Over
        ========================== */

        socket.on("game_over", (data) => {

            ludo.to(data.roomId).emit(

                "game_over",

                data.winner

            );

        });

        /* ==========================
           Disconnect
        ========================== */

        socket.on("disconnect", () => {

            console.log("🔴 Ludo Disconnected:", socket.id);

        });

    });

};
