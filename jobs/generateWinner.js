const cron = require("node-cron");
var Offer = require("../models/offer.model");
var OfferUser = require("../models/offerUser.model");
cron.schedule("00 11 * * *", () => {
    var date = new Date();
    console.log("*************************************cron job started ***************************************");
    console.log("generating todays winner at", date);
    var TodaysDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 5.5));
    var todaysTime = TodaysDate.getTime()
    var today = new Date(todaysTime - (todaysTime % (1000 * 60 * 60 * 24)))
    OfferUser.find(
        {
            endDate: {
                $gte: today
            },
            startDate: {
                $lte: today
            },
            alreadyWinner: false
        }
    )
        .then((offerUsers) => {
            console.log({ offerUsers });
            var numberOfUsers = offerUsers.length
            if (numberOfUsers == 0) {
                console.log("No offer users found");
            }
            else {
                var winnerIndex = Math.floor(Math.random() * (numberOfUsers))
                var winner = offerUsers[winnerIndex]
                console.log("winner:", winner);
                console.log("date:", today);
                // var todayTime = new Date().getTime()
                // var startOfToday = new Date(todayTime - (todayTime%(1000*60*60*24)))
                // console.log({startOfToday});
                Offer.findOne(
                    {
                        date: today,
                    }
                )
                    .then((offer) => {
                        console.log({ offer });
                        // for(var i=0;i<offers.length;i++)
                        // {
                        //     var todayTime = new Date().getTime()
                        //     var endOfToday = (startOfToday + (1000*60*60*24))
                        //     if(offers[i].date.getTime() >= startOfToday && offers[i].date.getTime() <= endOfToday)
                        //     {
                        //         exactOffer = offers[i]
                        //         break
                        //     }
                        // }
                        if (!offer) {
                            // send message to admin & developer that no offer is added
                            console.log("No offer added...");
                        }
                        else {
                            //send message to admin & developer that winner is genderated
                            Offer.findOneAndUpdate({ date: today }, { winnerName: winner.name, winnerPhoneNumber: winner.phoneNumber })
                                .then(() => {
                                    OfferUser.findOneAndUpdate({
                                        _id: winner._id
                                    }, {
                                        alreadyWinner: true
                                    })
                                        .then((offerUser) => {
                                            console.log("alreadyWinner attribute is set");
                                            console.log("winner generated successfully...");
                                            console.log("*************************************cron job ended ***************************************");
                                            // res.send({});
                                        })
                                        .catch((err) => {
                                            // res.status(400).json("Error"+err);
                                            console.log("Error occured while setting alreadyWinner attribute..", err);
                                        })
                                })
                                .catch((err) => {
                                    // res.status(400).json("Error"+err);
                                    console.log("Error occured while generating winner...", err);
                                })
                        }
                    })
                    .catch((err) => {
                        // res.status(400).json("Error"+err);
                        console.log("Error occured while generating winner...", err);
                    })
            }

        })
        .catch((err) => {
            // res.status(400).json("Error"+err)
            console.log("Error occured while fetchnig offerUsers count", err);
        })
});