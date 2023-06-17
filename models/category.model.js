const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    categoryImage: {
        type: String,
        required: true,
        trim: true
    },
    subCategoryList: [{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    }]
}, { timestamps: true });

var Category = mongoose.model("category", categorySchema);

module.exports = Category;