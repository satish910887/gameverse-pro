module.exports = (io) => {
  // FIX: use Map per namespace (not module-level array shared across restarts)
  const waitingPlayers = new Map(); // game -> [players]

  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id}`);

    socket.on("join_lobby", ({ userId, game }) => {
      if (!userId || !game) return socket.emit("error", { message: "userId and game required." });

      if (!waitingPlayers.has(game)) waitingPlayers.set(game, []);
      const queue = waitingPlayers.get(game);

      // FIX: prevent same user joining twice
      if (queue.some(p => p.userId === userId)) {
        return socket.emit("waiting", { message: "Already in queue." });
      }

      const opponent = queue.find(p => p.userId !== userId);
      if (opponent) {
        // Remove opponent from queue
        waitingPlayers.set(game, queue.filter(p => p.userId !== opponent.userId));

        const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
        socket.join(roomId);
        const opponentSocket = io.sockets.sockets.get(opponent.socketId);
        if (opponentSocket) {
          opponentSocket.join(roomId);
          io.to(roomId).emit("match_found", { roomId, players: [userId, opponent.userId] });
        }
      } else {
        queue.push({ socketId: socket.id, userId, game });
        socket.emit("waiting", { message: "Waiting for opponent..." });
      }
    });

    socket.on("leave_lobby", ({ game }) => {
      if (game && waitingPlayers.has(game)) {
        waitingPlayers.set(game, waitingPlayers.get(game).filter(p => p.socketId !== socket.id));
      }
    });

    socket.on("disconnect", () => {
      for (const [game, queue] of waitingPlayers.entries()) {
        waitingPlayers.set(game, queue.filter(p => p.socketId !== socket.id));
      }
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });
};
