require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");

const { Server } = require("socket.io");

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

/* ==========================
   Database
========================== */

connectDB();

/* ==========================
   Express
========================== */

const app = express();

const server = http.createServer(app);

const io = new Server(server, {

    cors:{

        origin:process.env.CLIENT_URL || "*",

        methods:["GET","POST"]

    }

});

/* ==========================
   Security
========================== */

app.use(

helmet({

contentSecurityPolicy:false

})

);

app.use(compression());

app.use(cors());

app.use(express.json({

limit:"10kb"

}));

app.use(express.urlencoded({

extended:true

}));

const limiter = rateLimit({

windowMs:15*60*1000,

max:100

});

app.use(limiter);

/* ==========================
   Static Frontend
========================== */

app.use(

express.static(

path.join(__dirname,"frontend")

)

);

/* ==========================
   API Routes
========================== */

app.use(

"/api/auth",

require("./routes/auth.routes")

);

app.use(

"/api/user",

require("./routes/user.routes")

);

app.use(

"/api/game",

require("./routes/game.routes")

);

app.use(

"/api/leaderboard",

require("./routes/leaderboard.routes")

);

app.use(

"/api/admin",

require("./routes/admin.routes")

);

/* ==========================
   Socket.io
========================== */

require("./sockets/lobby.socket")(io);

require("./sockets/ludo.socket")(io);

require("./sockets/chess.socket")(io);

/* ==========================
   Health Check
========================== */

app.get("/api/health",(req,res)=>{

res.json({

success:true,

status:"OK",

uptime:process.uptime(),

timestamp:new Date()

});

});

/* ==========================
   Frontend
========================== */

app.get("*",(req,res)=>{

res.sendFile(

path.join(

__dirname,

"frontend",

"index.html"

)

);

});

/* ==========================
   Start Server
========================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{

console.log(

`🚀 GameVerse Pro running on http://localhost:${PORT}`

);

});
