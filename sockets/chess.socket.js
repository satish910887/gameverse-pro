const chessRooms = {};

module.exports = (io) => {

    io.on("connection", (socket) => {

        // Join Chess Room
        socket.on("join_room", ({ roomId, userId }) => {

            socket.join(roomId);

            if (!chessRooms[roomId]) {

                chessRooms[roomId] = {
                    players: [],
                    turn: "white",
                    started: false,
                    board: null
                };

            }

            const room = chessRooms[roomId];

            if (!room.players.find(player => player.userId === userId)) {

                room.players.push({
                    socketId: socket.id,
                    userId,
                    color: room.players.length === 0 ? "white" : "black"
                });

            }

            io.to(roomId).emit("room_update", room.players);

            if (room.players.length === 2 && !room.started) {

                room.started = true;

                io.to(roomId).emit("game_start", {
                    players: room.players,
                    turn: room.turn
                });

            }

        });

        // Make Move
        socket.on("make_move", ({ roomId, move }) => {

            const room = chessRooms[roomId];

            if (!room) return;

            io.to(roomId).emit("move_made", move);

            room.turn =
                room.turn === "white"
                    ? "black"
                    : "white";

            io.to(roomId).emit("turn_changed", room.turn);

        });

        // Draw Offer
        socket.on("offer_draw", ({ roomId, userId }) => {

            socket.to(roomId).emit("draw_offered", {
                userId
            });

        });

        // Accept Draw
        socket.on("accept_draw", ({ roomId }) => {

            io.to(roomId).emit("game_draw");

            delete chessRooms[roomId];

        });

        // Resign
        socket.on("resign", ({ roomId, winner }) => {

            io.to(roomId).emit("game_over", {
                winner
            });

            delete chessRooms[roomId];

        });

        // Disconnect
        socket.on("disconnect", () => {

            Object.keys(chessRooms).forEach(roomId => {

                chessRooms[roomId].players =
                    chessRooms[roomId].players.filter(
                        p => p.socketId !== socket.id
                    );

                if (chessRooms[roomId].players.length === 0) {

                    delete chessRooms[roomId];

                }

            });

        });

    });

};
