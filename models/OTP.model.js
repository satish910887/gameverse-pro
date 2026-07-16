const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
{
    email: {
        type: String,
        lowercase: true,
        trim: true
    },

    mobile: {
        type: String,
        trim: true
    },

    otp: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: [
            "register",
            "login",
            "forgot-password",
            "verify-email",
            "verify-mobile"
        ],
        default: "login"
    },

    attempts: {
        type: Number,
        default: 0
    },

    verified: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0
        }
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("OTP", OTPSchema);
