const mongoose = require("mongoose");

const GameSessionSchema = new mongoose.Schema({

user:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},

game:{

type:String,

required:true,

enum:[

"ludo",

"chess",

"puzzle",

"runner",

"survival"

]

},

mode:{

type:String,

default:"single"

},

score:{

type:Number,

default:0

},

coinsEarned:{

type:Number,

default:0

},

xpEarned:{

type:Number,

default:0

},

result:{

type:String,

enum:[

"win",

"lose",

"draw"

],

default:"lose"

},

duration:{

type:Number,

default:0

},

moves:{

type:Number,

default:0

},

accuracy:{

type:Number,

default:100

},

cheatDetected:{

type:Boolean,

default:false

},

startedAt:{

type:Date,

default:Date.now

},

endedAt:{

type:Date

}

},

{

timestamps:true

}

);

/* ===========================
   Indexes
=========================== */

GameSessionSchema.index({

user:1,

game:1

});

GameSessionSchema.index({

score:-1

});

GameSessionSchema.index({

createdAt:-1

});

/* ===========================
   Methods
=========================== */

GameSessionSchema.methods.finish=function(){

this.endedAt=new Date();

return this.save();

};

/* ===========================
   Export
=========================== */

module.exports=mongoose.model(

"GameSession",

GameSessionSchema

);
