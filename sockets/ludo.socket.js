const rooms = {};

module.exports = (io) => {

    io.on("connection", (socket) => {

        // Join Room
        socket.on("join_room", ({ roomId, userId }) => {

            socket.join(roomId);

            if (!rooms[roomId]) {

                rooms[roomId] = {
                    players: [],
                    turn: 0,
                    dice: 0,
                    started: false
                };

            }

            const room = rooms[roomId];

            if (!room.players.find(p => p.userId === userId)) {

                room.players.push({
                    socketId: socket.id,
                    userId
                });

            }

            io.to(roomId).emit("room_update", room.players);

            if (room.players.length >= 2 && !room.started) {

                room.started = true;

                io.to(roomId).emit("game_start", {
                    roomId,
                    players: room.players,
                    turn: room.players[0].userId
                });

            }

        });

        // Roll Dice
        socket.on("roll_dice", ({ roomId }) => {

            const room = rooms[roomId];

            if (!room) return;

            const dice = Math.floor(Math.random() * 6) + 1;

            room.dice = dice;

            io.to(roomId).emit("dice_result", {
                player: socket.id,
                dice
            });

        });

        // Move Piece
        socket.on("move_piece", (data) => {

            io.to(data.roomId).emit("piece_moved", data);

            const room = rooms[data.roomId];

            if (!room) return;

            room.turn++;

            if (room.turn >= room.players.length) {

                room.turn = 0;

            }

            io.to(data.roomId).emit("next_turn", {
                userId: room.players[room.turn].userId
            });

        });

        // Game Over
        socket.on("game_over", ({ roomId, winner }) => {

            io.to(roomId).emit("game_finished", {
                winner
            });

            delete rooms[roomId];

        });

        // Disconnect
        socket.on("disconnect", () => {

            Object.keys(rooms).forEach(roomId => {

                rooms[roomId].players =
                    rooms[roomId].players.filter(
                        p => p.socketId !== socket.id
                    );

                if (rooms[roomId].players.length === 0) {

                    delete rooms[roomId];

                }

            });

        });

    });

};
