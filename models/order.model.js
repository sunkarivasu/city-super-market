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
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ["pending", "confirmed", "delivered", "cancelled"],
        default: "pending"
    },
    orderItems: [{
        type: mongoose.Schema.ObjectId,
        ref: "orderProduct",
        required: true
    }],
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

module.exports = Order;