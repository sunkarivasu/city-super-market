const router = require("express").Router();

//import Models
const Product = require("../models/product.model");


// route    :: GET /api/normalOffers/
// access   :: Public
// desc     :: returns all the special offers
router.get("/",
    (req, res) => {
        Product.find({ variants: { $elemMatch: { isSpecialOffer: true, isAvailable: true } } })
            .sort({ createdAt: -1 })
            .then((products) => res.json({
                msg: "Special offers fetched successfully",
                data: products
            }))
            .catch((err) => {
                console.error(`⚡[server][normalOffersRoute][get /] Error :: ${err}`);
                res.status(500).json({ msg: "Internal Server Error" });
            })

    })

module.exports = router;
