const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {                                    // 123
        type: String,
        trim: true
    },
    categoryId: {                                   // abc beauty
        ref: "category",
        type: mongoose.Schema.ObjectId,
        required: true
    },
    subCategory: {                                  // hair oils
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
    brand: {                                        // parachute
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    name: {                                         // coconut oil
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
        maxlength: 512,
        required: true
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
            default: "amount"
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    quantityType: {
        type: String,
        required: true,
        trim: true,
        enum: ["ml", "l", "g", "kg", "unit"]
    },

}, { timestamps: true });

const Product = mongoose.model("product", productSchema);

module.exports = Product;