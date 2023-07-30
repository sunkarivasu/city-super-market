const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    amountAfterDiscount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ["pending", "confirmed", "delivered", "cancelled", "returned"],
        default: "pending"
    },
    orderItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            orderQuantity: {
                type: Number,
                required: true,
                min: 0
            },
        }, { timestamps: true }
    ],
    deliveryAddress: {
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
        },
        district: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 255
        }
    }
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

module.exports = Order;