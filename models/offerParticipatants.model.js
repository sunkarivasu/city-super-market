var mongoose = require("mongoose");

var offerParticipantsSchema = new mongoose.Schema(
    {
        offerId: {
            ref: 'offer',
            type: mongoose.Schema.ObjectId,
            index: true,
        },
        offerUserId: {
            ref: 'offerUser',
            type: mongoose.Schema.ObjectId,
            index: true,
        },
        rank: {
            type: Number,
            index: true,
        },
        createdAt: {
            type: Date,
        }
    }
);

// Create a unique compound index on offerId and rank
offerParticipantsSchema.index({ offerId: 1, rank: 1 }, { unique: true });

var OfferParticipants = mongoose.model("offerParticipants", offerParticipantsSchema);

module.exports = OfferParticipants;
