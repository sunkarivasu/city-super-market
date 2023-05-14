var router = require("express").Router();
const { json } = require("express/lib/response");
var Offer = require("../models/offer.model");
var OfferUser = require("../models/offerUser.model");

router.route("/").get((req,res)=>
{
    Offer.find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/previousWinners").get((req,res)=>
{
    var today = new Date()
    var todaysTime = today.getTime()
    console.log(todaysTime);
    var hours = today.getHours()
    if(hours >= 17)
    {
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24))
    }
    else
    {
        var startDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)) - (1000*60*60*24*2))
    }
    console.log({startDate});
    Offer.find({
        date:{
            $lte:startDate
        }
    })
    .then((offers) => {
        console.log({offers});
        res.json(offers)})
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/add").post((req,res)=>
{
    var todaysTime = new Date().getTime()
    console.log(todaysTime);
    var todaysDate = new Date(todaysTime - (todaysTime%(1000*60*60*24)))
    console.log(new Date(todaysTime - (todaysTime%(1000*60*60*24))));
    console.log(new Date(todaysTime - (todaysTime%(1000*60*60*24))) + (1000*60*60*5.5));
    var newOffer = new Offer ({
        productName:req.body.productName,
        worth:req.body.price,
        description:req.body.description,
        image:req.body.image,
        date:todaysDate,
    });
    console.log(newOffer);
    newOffer.save()
    .then(() => res.json("offer added"))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/generateWinner").get((req,res)=>
{
    Offer.find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json("Error"+err));
});

router.route("/idNo/:idNumber").get((req,res) =>
{
    Offer.findById(req.params.idNumber)
    .then((offer) => {res.json(offer)})
    .catch((err) => {res.status(400).json("Error:"+err)});
});

router.route("/updateOfferDetails/").put((req,res) =>
{
    console.log(req.body);
    Offer.findByIdAndUpdate(req.body._id,{productName:req.body.productName,worth:req.body.worth,winnerName:req.body.winnerName,image:req.body.image,winnerImage:req.body.winnerImage})
        .then(() => {console.log("Offer updated successfully");res.send({})})
        .catch((err) => {console.log("Error Occured While updating offer details");})
});

router.route("/getTodaysWinner").get((req,res) =>
{
    console.log("fetching today's offer");
    var today = new Date()
    const todayTime = today.getTime()
    var todayDate = new Date(todayTime - (todayTime%(1000 * 60 * 60 * 24)))
    console.log(todayDate);
    Offer.findOne({date:todayDate})
    .then((offer) =>
    {
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})

router.route("/generateTodaysWinner").get((req,res) =>{
            console.log("generating todays winner");
            var presentDate = new Date();
            var presentDateISO = new Date().toISOString();
            console.log(presentDate,presentDateISO);
            OfferUser.find(
                {
                    endDate:{
                        $gte:presentDate
                    },
                    startDate:{
                        $lte:presentDate
                    },
                    alreadyWinner:false
                }
            )
            .then((offerUsers) =>
            {
                console.log({offerUsers});
                var numberOfUsers = offerUsers.length
                if(numberOfUsers == 0)
                {
                    console.log("No offer users found");
                }
                else
                {
                    var winnerIndex = Math.floor(Math.random() * (numberOfUsers))
                    var winner = offerUsers[winnerIndex]
                    console.log("winner:",winner);
                    console.log("date:",presentDate);
                    var exactOffer;
                    var todayTime = new Date().getTime()
                    var startOfToday = new Date(todayTime - (todayTime%(1000*60*60*24)))
                    console.log({startOfToday});
                    Offer.findOne(
                        {
                            date:startOfToday,
                        }
                    )
                    .then((offer) =>
                    {
                        console.log({offer});
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
                        if(!offer)
                        {
                            // send message to admin & developer that no offer is added
                            console.log("No offer added...");
                        }
                        else
                        {
                            //send message to admin & developer that winner is genderated
                            Offer.findOneAndUpdate({date:startOfToday},{winnerName:winner.name,winnerPhoneNumber:winner.phoneNumber})
                            .then(() =>
                            {
                                OfferUser.findOneAndUpdate({
                                       _id:winner._id 
                                },{
                                    alreadyWinner:true
                                })
                                .then((offer) =>{
                                    res.send({});
                                    console.log("alreadyWinner attribute is set");
                                    console.log("winner generated successfully...");
                                })
                                .catch((err) =>{
                                    console.log("Error occured while setting alreadyWinner attribute..",err);
                                })
                            })
                            .catch((err) =>
                            {
                                console.log("Error occured while generating winner...",err);
                            })
                        }
                    })
                    .catch((err) =>
                    {
                        console.log("Error occured while generating winner...",err);
                    })
                }
                
            })
            .catch((err) =>
            {
                console.log("Error occured while fetchnig offerUsers count",err);
            })
})

router.route("/getYesterdaysWinner").get((req,res) =>
{
    var today = new Date()
    var todayTime = today.getTime()
    console.log(today);
    var yesterday = new Date(todayTime - (todayTime%(1000 * 60 * 60 * 24)) - (1000 * 60 * 60 *24))
    console.log({yesterday});
    Offer.findOne({
        date: yesterday,
    }) 
    .then((offer) =>
    {
        console.log(offer);
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("error occured while fetching today's winner",err);
    })
})

router.route("/getTodaysOffer").get((req,res) =>
{
    console.log("fetching today's offer");
    var today = new Date()
    console.log(today);
    var todayStartTime = new Date(today.getFullYear(),today.getMonth(),today.getDate())
    var todayEndTime = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
    console.log(todayEndTime,todayStartTime);
    Offer.findOne({date:{
        $gte : todayStartTime,
        $lte : todayEndTime 
    }})
    .then((offer) =>
    {
        return res.json(offer)
    })
    .catch((err) =>
    {
        console.log("Error occured while fetching today's winner",err);
    })
})



module.exports=router;
