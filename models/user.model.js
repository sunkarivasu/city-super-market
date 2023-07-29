const mongoose = require("mongoose");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
        trim: true
    },
    encryPassword: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        required: false,
        minlength: 4,
        maxlength: 255,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        trim: true,
        unique: true
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
    },
    salt: String,
}, { timestamps: true });

userSchema.methods = {
    securePassword: function (plainPassword) {
        if (!plainPassword) return '';
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    authenticate: function (plainPassword) {
        // TODO: Check for Timing Attack
        console.log(plainPassword, this.securePassword(plainPassword), this.encryPassword, this.securePassword(plainPassword) === this.encryPassword);
        return this.securePassword(plainPassword) === this.encryPassword;
    }
};

userSchema.virtual("password")
    .set(function (plainPassword) {
        this.salt = uuidv4();
        this.encryPassword = this.securePassword(plainPassword);
    });

const User = mongoose.model("user", userSchema);

module.exports = User;