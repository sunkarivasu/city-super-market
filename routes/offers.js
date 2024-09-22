var router = require("express").Router();
const { json } = require("express/lib/response");
var Offer = require("../models/offer.model");
var OfferUser = require("../models/offerUser.model");
const OfferParticipants = require("../models/offerParticipatants.model");
const res = require("express/lib/response");
const { isAdmin } = require("../client/src/utils/validators");
const passport = require("passport");
const { current } = require("@reduxjs/toolkit");
const { addHexAndDecimalToHash } = require("../utils/string");
const { generateWinner } = require("../services/offers");
const { response } = require("express");

router.route("/").get((req,res)=>
{
    Offer.find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/previousWinners").get((req,res)=>
{
    var date = new Date();
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var hours = today.getHours()
    if(hours >= 17)
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24))
    else
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24*2))
    Offer.find({
        date:{
            $lte:startDate
        }
    })
    .then((offers) => {
        res.json(offers);
    })
    .catch((err) => res.status(400).json("Error"+err));

});

router.route("/add").post((req,res)=>
{
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var todaysDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)))
    var newOffer = new Offer ({
        productName:req.body.productName,
        worth:req.body.price,
        description:req.body.description,
        image:req.body.image,
        date:todaysDate,
    });
    newOffer.save()
    .then(() => {
        res.json("offer added");
})
    .catch((err) => res.status(400).json("Error"+err));

});

router.route("/idNo/:idNumber").get((req,res) =>
{
    Offer.findById(req.params.idNumber)
    .then((offer) => {
        res.json(offer)
    })
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/getluckycode").get((req, res) => {
    console.log("fetching lucky code")
    const TodaysDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5));
    var todaysTime = TodaysDate.getTime()
    var today = new Date(todaysTime - (todaysTime % (1000 * 60 * 60 * 24)))
    Offer.findOne({
        date: today
    })
    .then((offer) => {
        if(!offer){
            return res.status(404).json(
                {
                    msg: "No Active Offer",
                    data: null
                }
            )
        }
        else{
            if(!offer.winnerPhoneNumber){
                return res.status(400).json(
                    {
                        msg: "Winner Not Yet Generated",
                        data: null
                    }
                )
            }
            else{
                OfferUser.findOne(
                    {
                        phoneNumber: offer.winnerPhoneNumber
                    }
                )
                .then((offeruser) => {
                    OfferParticipants.findOne({
                        offerUserId: offeruser._id,
                        offerId: offer._id
                    })
                    .then((offerparticipant) => {
                        console.log(offer, offerparticipant)
                        return res.status(200).json(
                            {
                                msg: "Lucky Code Fetched successfully",
                                data: {
                                    code: addHexAndDecimalToHash(offer._id.toString().substring(0,6), offerparticipant.rank)
                                }
                            }
                        )
                    })
                    .catch((err) => {
                        console.error(err)
                        return res.status(500).json(
                            {
                                msg:"Internal Server Error",
                                data: null
                            }
                        )
                    })
                })
                .catch((err) => {
                    console.error(err)
                    return res.status(500).json(
                        {
                            msg:"Internal Server Error",
                            data: null
                        }
                    )
                })
            }
        }
    })
    .catch((err) => {
        console.error(err)
        return res.status(500).json(
            {
                msg:"Internal Server Error",
                data: null
            }
        )
    })
})

router.route("/updateOfferDetails/").put((req,res) =>
{
    Offer.findByIdAndUpdate(req.body._id,{productName:req.body.productName,worth:req.body.worth,winnerName:req.body.winnerName,image:req.body.image,winnerImage:req.body.winnerImage})
        .then(() => {
            res.send({});
        })
        .catch((err) => {console.log("Error Occured While updating offer details");})
});

router.route("/getTodaysWinner").get((req,res) =>
{
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var todaysDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
    Offer.findOne({date:todaysDate})
    .then((offer) =>
    {
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})

router.route("/getYesterdaysWinner").get((req,res) =>
{
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todayTime = today.getTime()
    var yesterday = new Date(todayTime - (todayTime%(1000 * 60 * 60 * 24))  - (1000 * 60 * 60 *24))
    Offer.findOne({
        date: yesterday,
    })
    .then((offer) =>
    {
        res.json(offer)
    })
    .catch((err) =>
    {
        console.log("error occured while fetching today's winner",err);
    })
})

router.route("/getTodaysOffer").get((req,res) =>
{
    var today = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5))
    var todaysTime = today.getTime()
    var todaysDate = new Date(todaysTime - (todaysTime%(1000 * 60 * 60 * 24)))
    Offer.findOne({date:todaysDate})
    .then((offer) =>
    {
        res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})

router.route("/participate").post(async (req, res) => {
    var offerUser = await OfferUser.findOne({phoneNumber: req.body.phoneNumber})
    if(!offerUser){
        return res.status(401).json("Unauthenticated User")
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to the beginning of today (midnight)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of today

    Offer.findOne({
        isActive: true,
        date: { $gte: startOfDay, $lte: endOfDay } // Check that the date is within today
    })
    .then(async (offer) => {
        if(!offer){
            return res.status(404).json("Offer Not Found")
        }
        var existingOfferParticipantRecord = await OfferParticipants.findOne({offerId: offer._id, offerUserId: offerUser._id})
        if(existingOfferParticipantRecord){
            return res.status(200).json(
                {
                    "rank":  addHexAndDecimalToHash(offer._id.toString().substring(0, 6), existingOfferParticipantRecord.rank),
                    "name": offerUser.name,
                    "isAlreadyParticipated": true
                }
            )
        }
        const rank = await saveOfferParticipant(offer, offerUser);
        return res.status(200).json({
            "name": offerUser.name,
            "rank": addHexAndDecimalToHash(offer._id.toString().substring(0, 6), rank),
            "isAlreadyParticipated": false
        })
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json("Internal Server Error")
    })
})

router.route("/activate-offer",).put(
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    async (req, res) => {
        var existingOffer = await Offer.findOne({_id: req.body.offerId})
        if(!existingOffer){
            res.status(404).json({
                "message":"Offer not Found",
            })
        }
        existingOffer.isActive = true
        existingOffer.activatedAt = new Date()
        existingOffer.save()
        .then(() => {
            return res.status(200).json({
                "message":"Offer Activated Successfully",
                "data": null
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                message: "Something went wrong",
                data: null
            })
        })

})

router.route('/isofferactive').get(async (req, res) => {
    try {
        console.log("checking for active offers")
        // Find the most recent active offer
        var activeOffer = await Offer.findOne({ isActive: true })
            .sort({ activatedAt: -1 })
            .exec();
        console.log("activeOffer", activeOffer)

        // If no active offer is found
        if (!activeOffer) {
            return res.status(404).json({
                message: "Offer not found"
            });
        }

        // Get the current time and the activation period in milliseconds
        const currentTime = new Date().getTime();
        var expiresAt = null;
        if (activeOffer.isActive) {
            // Clone the activatedAt date to avoid mutating the original date
            expiresAt = new Date(activeOffer.activatedAt.getTime());

            // Set time to 8:00 PM (20:00 hours)
            expiresAt.setHours(14, 30, 0, 0);
            // expiresAt.setHours(20, 0, 0, 0);
        }
        console.log("expiresAt", expiresAt.getTime(), expiresAt)
        console.log("current time", currentTime, new Date(currentTime))
        console.log("offer activatedAt", activeOffer.activatedAt.getTime(), new Date(activeOffer.activatedAt.getTime()))
        // Check if the offer is still within the activation period
        if (activeOffer.isActive && activeOffer.activatedAt && (currentTime >= activeOffer.activatedAt.getTime() && currentTime <= expiresAt.getTime())) {
            console.log("active")
            return res.status(200).json({
                message: "Data fetched successfully",
                data: {
                    // isActive: true,
                    isActive: false,
                }
            });
        } else {
            console.log("inactive")
            return res.status(200).json({
                message: "Data fetched successfully",
                data: {
                    isActive: false,
                }
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
})

router.route("/fetchparticipantscount/:id").get((req,res) =>
    {
        OfferParticipants.countDocuments({offerId:req.params.id})
        .then((count) =>
        {
            res.status(200).json({
                message:"participants count fetched successfully",
                data:{
                    count: count
                }
            })
        })
        .catch((err) =>
        {
            res.status(500).json({
                message:"Something went wrong",
                data: null
            })
            console.log("Error occured while fetching participants count",err);
        })
    })


router.route("/generateTodaysWinner").get(async (req,res) =>{
    generateWinner
    .then((response) => {
        res.status(response.statusCode).json({
            msg: response.msg,
            data: null
        })
    })
    .catch((err) => {
        res.status(500).json({
            msg: "Internal Server Error",
            data: null
        })
    })
})

const saveOfferParticipant = async (offer, offerUser) => {
    let noOfExistingRecords = await OfferParticipants.countDocuments({ offerId: offer._id });
    console.log("offer", offer, noOfExistingRecords);
    let rank = noOfExistingRecords + 1; // Start with the expected rank

    const offerParticipantData = {
        offerId: offer._id,
        offerUserId: offerUser._id,
        rank: rank,
        createdAt: new Date(),
    };
    console.log("offerParticipantData", offerParticipantData)

    let saved = false;

    while (!saved) {
        try {
            // Create a new participant instance with the current rank
            const offerParticipant = new OfferParticipants(offerParticipantData);

            // Attempt to save
            await offerParticipant.save();
            saved = true;
            // If successful, set saved to true
            if(rank == 1){
                offer.winnerName = offerUser.name,
                offer.winnerPhoneNumber = offerUser.phoneNumber
            }
            await offer.save()
        } catch (err) {
            // Check if it's a MongoDB duplicate key error (code 11000)
            if (err.code === 11000 && err.keyPattern && err.keyPattern.offerId && err.keyPattern.rank) {
                // If the combination of offerId and rank is duplicated, increment the rank and try again
                rank++;
                offerParticipantData.rank = rank; // Update the rank in the data object
            } else {
                // If it's another kind of error, throw it
                throw err;
            }
        }
    }
    return offerParticipantData.rank;
};



module.exports=router;
