const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        trim: true
    },
    address: [{
        doorNumber: {
            type: String,
            required: true,
            trim: true
        },
        streetName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 255
        },
        landMark: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 255
        },
        village: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 255
        },
        pincode: {
            type: Number,
            required: true,
            min: 99999,
            max: 999999,
        },
        mandal: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 255
        }
    }],
    cartItems: [{
        ref: "orderProduct",
        type: mongoose.Schema.ObjectId
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;