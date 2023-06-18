const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        trim: true,
        required: false,
    },
    categoryId: {
        ref: "category",
        type: mongoose.Schema.ObjectId,
        required: true
    },
    subCategory: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    description: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 512
    },
    variants: [{
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 1
        },
        isSpecialOffer: {
            type: Boolean,
            default: false
        }
    }],
    quantityType: {
        type: String,
        required: true,
        trim: true,
        enum: ["ml", "l", "g", "kg", "unit"]
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    discountType: {
        type: String,
        trim: true,
        enum: ["percent", "amount"],
        default: "percent"
    },
    isAvailable: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

const Product = mongoose.model("product", productSchema);

module.exports = Product;