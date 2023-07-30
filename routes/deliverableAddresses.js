const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { checkIsAdmin } = require("../validations/user.validation");
const passport = require("passport");

// Models
const DeliverableAddress = require("../models/deliverableAddress.model");

//validations
const { validateAddress } = require("../validations/deliverableAddresses.validation")


// route        :: GET /api/deliverableAddresses
// access       :: Public
// desc         :: Get all deliverable addresses
router.get("/",
    (req, res) => {
        DeliverableAddress.find({})
            .then((addresses) => {
                res.status(200).send({ msg: "DeliverableAddresses fetched successfully", data: addresses });
            })
            .catch((err) => {
                console.error(`⚡[server][deliverablesAddressesRoute][get /][occurence::while fetching deliverable addresses], Error :: ${err}`);
                res.status(500).send({ msg: "Internal Server Error" })
            })
    })


// route        :: POST /api/deliverableAddresses/add
// access       :: Admin
// desc         :: Add new Deliverable Address
router.post("/add",
    passport.authenticate("jwt", { session: false }),
    checkIsAdmin,
    validateAddress,
    (req, res) => {
        let deliverableAddress = new DeliverableAddress({
            village: req.body.village,
            mandal: req.body.mandal,
            district: req.body.district
        })

        deliverableAddress.save()
            .then((address) => {
                res.status(200).send({ msg: "new deliveryAddress added successfully", data: [] })
            })
            .catch((err) => {
                console.error(`⚡[server][deliverableAddressesRoute][post /add][occurence::while adding new deliverableAddress], Error :: ${err}`);
                res.status(500).send({ msg: "Internal Server Error" })
            })

    })

module.exports = router;