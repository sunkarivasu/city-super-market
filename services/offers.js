var Offer = require("../models/offer.model");
const OfferParticipants = require("../models/offerParticipatants.model");
var OfferUser = require("../models/offerUser.model");


const generateWinner = new Promise ((resolve, reject) => {
    console.log("*************************************cron job started ***************************************");
    const date = new Date();
    console.log("generating todays winner at", date);
    const TodaysDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5));
    var todaysTime = TodaysDate.getTime()
    var today = new Date(todaysTime - (todaysTime % (1000 * 60 * 60 * 24)))
    Offer.findOne({
        date: today
    })
    .then((offer) => {
        if(offer.isActive){
            resolve({
                msg: "Offer is not active",
                statusCode : 400
            })
            return
        }
        console.log("finding offer")
        if(offer){
            console.log("offer found")
            if(offer.winnerName){
                console.log("winner already gen")
                resolve({
                    msg:"Winner Already Generated",
                    statusCode : 400
                })
                return
            }
            OfferParticipants.aggregate([
                {
                    $match : {
                        offerId: offer._id
                    },
                },
                {
                    $lookup: {
                        from: "offerusers",                // Join with the customers collection
                        localField: "offerUserId",          // Field from orders
                        foreignField: "_id",               // Field from customers
                        as: "offerUserDetails"              // Name of the new array field to store joined data
                    }
                },
                {
                    $unwind: "$offerUserDetails"          // Unwind the array to get individual customer objects
                },
                {
                    $match: {                            // Filter results based on conditions
                        "offerUserDetails.startDate": { $lte : today },
                        "offerUserDetails.endDate": { $gte : today}
                    }
                }
            ])
            .then((offerParticipants) => {
                console.log("offerParticipants", offerParticipants);
                if(offerParticipants.length == 0){
                    resolve({
                        msg: "No Active Participants",
                        statusCode: 400
                    })
                }
                var winnerIndex = Math.floor(Math.random() * (offerParticipants.length))
                var winner = offerParticipants[winnerIndex]
                console.log("winner:", winner);
                console.log("date:", today);
                console.log("old offer", offer);
                OfferUser.findOneAndUpdate({
                    _id: winner.offerUserId
                }, {
                    alreadyWinner: true
                })
                .then(async (offerUser) => {
                    console.log("alreadyWinner attribute is set");
                    offer.winnerName = offerUser.name,
                    offer.winnerPhoneNumber = offerUser.phoneNumber

                    try{
                        console.log("new Offer details", offer);
                        await offer.save();
                        resolve({
                            msg: "Winner generated successfully",
                            statusCode : 200
                        })
                        console.log("winner generated successfully...");
                        console.log("*************************************cron job ended ***************************************");
                        return
                    }
                    catch(err) {
                        console.error("Error Occured While savinng offer details", err);
                        reject("");
                        return
                    }

                })
                .catch((err) => {
                    // res.status(400).json("Error"+err);
                    console.error("Error occured while setting alreadyWinner attribute..", err);
                    reject("");
                    return
                })

            })
            .catch((err) => {
                console.error("Something Went Wrong", err);
                reject("")
                return
            })
        }
        else{
            console.warn("No Offer Added today unable to Generate Winner");
            console.log("*************************************cron job ended ***************************************");
            resolve({
                msg:"No Offer Added today unable to Generate Winner",
                statusCode: 400
            })
            return
        }
    })
    .catch((err) => {
        console.error("Something Went Wrong", err)
        reject("")
        return
    })
});

module.exports = {generateWinner}