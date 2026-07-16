const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(

{

username:{

type:String,
required:true,
trim:true,
unique:true,
minlength:3,
maxlength:30

},

email:{

type:String,
required:true,
unique:true,
lowercase:true,
trim:true

},

password:{

type:String,
required:true,
minlength:6

},

avatar:{

type:String,
default:"default.png"

},

coins:{

type:Number,
default:0

},

xp:{

type:Number,
default:0

},

level:{

type:Number,
default:1

},

wins:{

type:Number,
default:0

},

losses:{

type:Number,
default:0

},

gamesPlayed:{

type:Number,
default:0

},

highestScore:{

type:Number,
default:0

},

badges:[

{

type:String

}

],

friends:[

{

type:mongoose.Schema.Types.ObjectId,
ref:"User"

}

],

isAdmin:{

type:Boolean,
default:false

},

isBanned:{

type:Boolean,
default:false

},

cheatFlags:{

type:Number,
default:0

},

lastLogin:{

type:Date,
default:Date.now

}

},

{

timestamps:true

}

);

/* ===========================
   Virtual
=========================== */

UserSchema.virtual("winRate").get(function(){

if(this.gamesPlayed===0){

return 0;

}

return Math.round(

(this.wins/this.gamesPlayed)*100

);

});

/* ===========================
   Methods
=========================== */

UserSchema.methods.addCoins=function(amount){

this.coins+=amount;

return this.save();

};

UserSchema.methods.addXP=function(amount){

this.xp+=amount;

while(this.xp>=this.level*100){

this.xp-=this.level*100;

this.level++;

}

return this.save();

};

/* ===========================
   Export
=========================== */

module.exports=mongoose.model(

"User",

UserSchema

);
