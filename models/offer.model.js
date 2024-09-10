var mongoose = require("mongoose");

var offerSchema = new mongoose.Schema(
    {
        productName:String,
        description:String,
        image:String,
        worth:Number,
        date:Date,
        winnerName:String,
        winnerPhoneNumber:{
            type:String,
            default:""
        },
        winnerImage:String,
        isActive:{
            type: Boolean,
            default: false
        },
        activatedAt : {
            type: Date,
            default: null
        }
    }
);

var Offer = mongoose.model("offer",offerSchema);

module.exports = Offer;