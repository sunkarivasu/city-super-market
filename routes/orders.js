const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { checkIsAdmin } = require("../validations/user.validation");
const { validateUserOrder } = require("../validations/order.validation");
const { minimumOrderAmount, minimumOrderAmountWithoutDiscount } = require("../utils/constants");
const passport = require("passport");
const { checkForOutOfStockProducts } = require("../services/order.service")
const constants = require("../constants")


// Models
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const OrderProduct = require("../models/orderProduct.model");
const DeliverableAddress = require("../models/deliverableAddress.model");


// route     :: GET /api/orders
// desc      :: Get all orders
//access     :: Admin
router.get("/",
    passport.authenticate('jwt', { session: false }),
    checkIsAdmin,
    (req, res) => {
        Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                }
            },
            {
                $unwind: "$userDetails"
            }
        ])
            .then((orders) => {
                console.log(orders[0]['orderItems'].length);
                orders.forEach((order) => {
                    for (let i = 0; i < order['orderItems'].length; i++) {
                        let orderProductId = order['orderItems'][i]
                        let orderItemDetails = {}
                        OrderProduct.findById(orderProductId)
                            .then((orderProduct) => {
                                orderItemDetails = orderProduct
                                Product.findById(orderProduct['productId'])
                                    .then((product) => {
                                        console.log(product);
                                        orderItemDetails = { product }
                                        orderItemDetails['quantity'] = orderProduct['quantity']
                                        orderItemDetails['orderQuantity'] = orderProduct['orderQuantity']
                                        order['orderItems'][i] = orderItemDetails
                                        console.log({ orderItemDetails: orderItemDetails });
                                    })
                                    .catch((err) => console.log("Error occured while fetching product details", err))
                            }).catch((err) => console.log("Error occured while fetching orderProduct details", err))
                    }
                })
                res.send({ ...orders });
            })
            .catch((err) => {
                res.status(400).send("Error:" + err)
            })
    })


// route     :: Post/api/orders/add
// desc:     :: Add a new order
// access    :: User
router.post("/add",
    passport.authenticate('jwt', { session: false }),
    validateUserOrder,
    (req, res) => {
        let deliveryAddress = req.body.deliveryAddress
        User.findById(req.body.userId)
            .then((user) => {
                if (user) {
                    DeliverableAddress.findOne({ district: deliveryAddress.district, mandal: deliveryAddress.mandal, village: deliveryAddress.village })
                        .then(async (address) => {
                            if (address) {
                                let orderItems = req.body.orderItems
                                await checkForOutOfStockProducts(orderItems)
                                    .then((data) => {
                                        let listOfNotFoundProducts = data.listOfNotFoundProducts
                                        let listOfOutOfStockProducts = data.listOfOutOfStockProducts
                                        let orderAmount = data.orderAmount
                                        let orderAmountAfterDiscount = data.orderAmountAfterDiscount

                                        // check for minimum order amount
                                        if (listOfNotFoundProducts.length == 0 && listOfOutOfStockProducts.length == 0) {
                                            console.log(constants);
                                            if (constants["minimumOrderAmountWithoutDiscount"] ? orderAmount < constants["minimumOrderAmount"] : orderAmountAfterDiscount < constants["minimumOrderAmount"]) {
                                                res.status(200).send({ msg: "Minimum order amount " + (constants["minimumOrderAmountWithoutDiscount"] ? "" : "(After Discount) ") + "of RS " + constants["minimumOrderAmount"] + " Required to place order", data: [] })
                                            }
                                            else if (req.body.amount !== orderAmount || req.body.amountAfterDiscount !== orderAmountAfterDiscount) {
                                                res.status(200).send({
                                                    msg: "There is a Change in Total Price While placing the order", data: {
                                                        amount: orderAmount,
                                                        amountAfterDiscount: orderAmountAfterDiscount
                                                    }
                                                })
                                            }
                                            else {
                                                Order.count()
                                                    .then((count) => {
                                                        let newOrder = new Order({
                                                            orderId: (10000 + count).toString(),
                                                            userId: req.body.userId,
                                                            orderItems: req.body.orderItems,
                                                            amount: orderAmount,
                                                            amountAfterDiscount: orderAmountAfterDiscount,
                                                            quantity: req.body.quantity,
                                                            deliveryAddress: req.body.deliveryAddress,
                                                            status: "pending"
                                                        })
                                                        newOrder.save()
                                                            .then((order) => {
                                                                res.status(201).send({ msg: "Order placed successfully", data: [] })
                                                            })
                                                            .catch((err) => {
                                                                console.error(`⚡[server][ordersRoute][post /add][occurence::while placing new order], Error :: ${err}`);
                                                                res.status(500).send({ msg: "Internal Server Error" })
                                                            })
                                                    })
                                                    .catch((err) => {
                                                        console.error(`⚡[server][ordersRoute][post /add][occurence::while counting number of records in orders collection], Error :: ${err}`);
                                                        res.status(500).send({ msg: "Internal Server Error" })
                                                    })
                                            }
                                        }
                                        else {
                                            res.status(200).send({ msg: "Few products are out of stock", data: listOfOutOfStockProducts.concat(listOfNotFoundProducts) })
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }
                            else {
                                res.status(200).send({ msg: "Can't be delivered to given address", data: [] })
                            }
                        })
                        .catch((err) => {
                            console.error(`⚡[server][ordersRoute][post /add][occurence::while checking for deliverableAddress], Error :: ${err}`);
                            res.status(500).send({ msg: "Internal Server Error" })
                        })

                }
                else {
                    return res.status(404).send("User not found")
                }
            })
            .catch((err) => {
                console.error(`⚡[server][ordersRoute][post /add][occurence::while checking for the user], Error :: ${err}`);
                res.status(500).send({ msg: "Internal Server Error" })
            })
    });


// router.route("/placeOrderFromCart/").post((req,res)=>
// {

// })

router.route("/getOrdersByUserId/:userId").get((req, res) => {
    var id = mongoose.Types.ObjectId(req.params.userId)
    //console.log("UserId:"+id);
    //Order.aggregate([{$match:{userId:id}}])
    Order.aggregate([{ $match: { userId: id } }, {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails"
        }
    }])
        .then((orders) => {
            res.send(orders)
        })
        .catch((err) => {
            console.log("Error occured while joining products and orders collections:" + err)
        })
    // Order.find({_id:req.params.userId})
    // .then((orders)=>
    // {
    //     orders.forEach((order) =>
    //     {
    //         var productDetails = Product.findOne({_id:order.productId})
    //     })
    // })
    // .then(
    // Order.find({userId:req.params.userId})
    // .then((orders) =>
    // {
    //     res.send(orders)
    // }))
    // .catch((err) =>
    // {
    //     res.status(400).send("Error:"+err);
    // })
});

module.exports = router;