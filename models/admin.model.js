const { Schema, model } = require('mongoose');
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const adminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        minlength: 3
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 255,
        minlength: 7
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        default: uuidv4()
    }
}, { timestamps: true });

adminSchema.virtual('password')
    .set(function (plainPassword) {
        console.log(plainPassword);
        const hashedPassword = this.encryptPassword(plainPassword);
        console.log('test');
        if (hashedPassword) {
            console.log(hashedPassword);
            this.hashed_password = hashedPassword;
        } else {
            throw new Error('Password is not valid');
        }
    });

adminSchema.methods = {
    encryptPassword(plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            console.error('[server][adminModel][encryptPassword] Error while encrypting password', err);
            return "";
        }
    },
    authenticate(plainPassword) {
        if (!this.hashed_password) return false;
        const hashedPassword = this.encryptPassword(plainPassword);
        if (hashedPassword) return crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(this.hashed_password));
        return false;
    }
};

const Admin = model('Admin', adminSchema);

module.exports = Admin;