/* ======================================
   GameVerse Pro
   Chess Socket
====================================== */

module.exports = (io) => {

    const chess = io.of("/chess");

    chess.on("connection", (socket) => {

        console.log("🟢 Chess Connected:", socket.id);

        /* ==========================
           Join Room
        ========================== */

        socket.on("join_room", (data) => {

            socket.join(data.roomId);

            socket.to(data.roomId).emit("player_joined", {
                playerId: socket.id
            });

            chess.to(data.roomId).emit("game_start", {
                roomId: data.roomId,
                turn: "white"
            });

        });

        /* ==========================
           Chess Move
        ========================== */

        socket.on("make_move", (data) => {

            chess.to(data.roomId).emit("move_made", {
                from: data.from,
                to: data.to,
                piece: data.piece,
                player: socket.id
            });

        });

        /* ==========================
           Timer Update
        ========================== */

        socket.on("timer_update", (data) => {

            chess.to(data.roomId).emit("timer_update", {
                whiteTime: data.whiteTime,
                blackTime: data.blackTime
            });

        });

        /* ==========================
           Check
        ========================== */

        socket.on("check", (data) => {

            chess.to(data.roomId).emit("check", {
                king: data.king
            });

        });

        /* ==========================
           Checkmate
        ========================== */

        socket.on("checkmate", (data) => {

            chess.to(data.roomId).emit("game_over", {
                winner: data.winner,
                reason: "checkmate"
            });

        });

        /* ==========================
           Draw Offer
        ========================== */

        socket.on("offer_draw", (data) => {

            socket.to(data.roomId).emit("draw_offer");

        });

        socket.on("draw_response", (data) => {

            chess.to(data.roomId).emit("draw_response", {
                accepted: data.accepted
            });

        });

        /* ==========================
           Resign
        ========================== */

        socket.on("resign", (data) => {

            chess.to(data.roomId).emit("game_over", {
                winner: data.winner,
                reason: "resign"
            });

        });

        /* ==========================
           Disconnect
        ========================== */

        socket.on("disconnect", () => {

            console.log("🔴 Chess Disconnected:", socket.id);

        });

    });

};
