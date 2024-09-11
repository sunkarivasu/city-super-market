var mongoose = require("mongoose");

var offerParticipantsSchema = new mongoose.Schema(
    {
        offerId:{
            ref: 'offer',
            type: mongoose.Schema.ObjectId,
            index: true,
        },
        offerUserId:{
            ref: 'offerUser',
            type: mongoose.Schema.ObjectId,
            index: true,
        },
        rank:{
            type: Number,
            index: true,
            unique: true,
        },
        createdAt:{
            type:Date,
        }
    }
);

var OfferParticipants = mongoose.model("offerParticipants", offerParticipantsSchema);

module.exports = OfferParticipants;