const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["superadmin", "admin", "moderator"],
        default: "admin"
    },

    permissions: [{
        type: String
    }],

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date
    }

},
{
    timestamps: true
});

// Hash password before save
AdminSchema.pre("save", async function(next){

    if(!this.isModified("password"))
        return next();

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    next();

});

// Compare password
AdminSchema.methods.comparePassword = async function(password){

    return bcrypt.compare(password, this.password);

};

module.exports = mongoose.model("Admin", AdminSchema);
