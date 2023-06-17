const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema({
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
}, { timestamps: true });

const OrderProduct = new mongoose.model("orderProduct", orderProductSchema);

module.exports = OrderProduct;