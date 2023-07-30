const mongoose = require("mongoose");

const deliverableAddressSchema = new mongoose.Schema({
    district: {                                    // vijayanagaram
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    mandal: {                                    // santhakaviti
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    village: {                                  // ponugutivalasa
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    }
}, { timestamps: true });

const DeliverableAddress = mongoose.model("deliverableAddress", deliverableAddressSchema);

module.exports = DeliverableAddress;