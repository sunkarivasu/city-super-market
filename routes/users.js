const router = require('express').Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// import validations
const { checkIsAdmin, validateUserRegister, validateUserLogin, checkIsAdminOrSelf } = require('../validations/user.validation');

// import models
const User = require("../models/user.model");
const Product = require('../models/product.model');


// route    :: GET /api/users
// access   :: admin
// desc     :: get all users
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkIsAdmin,
    (req, res) => {
        User.find()
            .then(users => {
                if (users.length) {
                    return res.json(users.map(user => ({
                        id: user._id,
                        name: user.name,
                        email: user.email ? user.email : '',
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    })));
                } else {
                    return res.json([]);
                }
            })
            .catch(err => {
                console.error(`⚡[server][userRoute][get /] Error :: ${err}`);
                res.status(500).json({ msg: 'Internal Server Error' });
            })
    }
);

// route    :: GET /api/users/:id
// access   :: admin | self
// desc     :: get user by id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkIsAdminOrSelf,
    (req, res) => {
        User.findById(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ msg: 'User not found' });
                }

                return res.json({
                    id: user._id,
                    name: user.name,
                    email: user.emailId ? user.emailId : '',
                    phoneNumber: user.phoneNumber,
                    address: user.address ? user.address : '',
                    isAdmin: user.isAdmin,
                    cartItems: user.cartItems.length ? user.cartItems : [],
                });
            })
            .catch(err => {
                console.error(`⚡[server][userRoute][get /:id] Error :: ${err}`);
                res.status(500).json({ msg: 'Internal Server Error' });
            });
    }
);

// route    :: POST /api/users
// access   :: public
// desc     :: user registration
router.post(
    '/',
    validateUserRegister,
    (req, res) => {
        User.findOne({ phoneNumber: req.body.phoneNumber })
            .then(user => {
                if (user) {
                    return res.status(422).json({ msg: 'User already exists' });
                } else {
                    let newUser = {
                        name: req.body.name,
                        password: req.body.password,
                        phoneNumber: req.body.phoneNumber,
                    };
                    if (req.body.email) newUser.emailId = req.body.email;

                    newUser = new User(newUser);


                    newUser.save()
                        .then(user => {
                            return res.json({
                                msg: 'User registered successfully',
                                data: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email ? user.email : '',
                                    phoneNumber: user.phoneNumber
                                }
                            });
                        })
                        .catch(err => {
                            console.error(`⚡[server][userRoute][post /] Error :: ${err}`);
                            res.status(500).json({ msg: 'Internal Server Error' });
                        });
                }
            })
            .catch(err => {
                console.error(`⚡[server][userRoute][post /] Error :: ${err}`);
                res.status(500).json({ msg: 'Internal Server Error' });
            });
    }
);

// route    :: POST /api/users/login
// access   :: public
// desc     :: user login
router.post(
    '/login',
    validateUserLogin,
    (req, res) => {
        User.findOne({ phoneNumber: req.body.phoneNumber, isAdmin: false })
            .then(user => {
                if (!user || !user.authenticate(req.body.password)) {
                    return res.status(404).json({ msg: 'Invalid Credentials' });
                }

                const jwtPayload = {
                    id: user._id,
                    name: user.name,
                    email: user.email ? user.email : '',
                    isAdmin: user.isAdmin,
                    phoneNumber: user.phoneNumber
                };

                jwt.sign(
                    jwtPayload,
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) {
                            console.error('[server][userRoute][login] Error while generating token', err);
                            return res.status(500).json({ msg: 'Internal Server Error' });
                        }

                        return res.json({
                            msg: 'User Logged In Successfully',
                            data: {
                                token: `Bearer ${token}`
                            }
                        });
                    }
                );
            })
            .catch(err => {
                console.error(`⚡[server][userRoute][post /login] Error :: ${err}`);
                res.status(500).json({ msg: 'Internal Server Error' });
            });
    }
);


router.route("/getUserDetailsById/:userId").get((req, res) => {
    User.findById({ _id: req.params.userId })
        .then((user) => res.json(user))
        .catch((err) => res.json(400).json("Error:" + err))
})

router.route("getuserId/:userId").get(passport.authenticate("jwt", { session: false }), (req, res) => {
    User.findOne({ _id: req.params.userId })
        .then((user) => res.json(user))
        .catch((err) => { res.status(400).json("Error:" + err) });
})

router.route("/checkEmailId/:emailId").get((req, res) => {
    console.log(req.params.emailId);
    User.findOne({ emailId: req.params.emailId })
        .then((user) => {
            console.log(user);
            if (user) {
                res.send({
                    msg: "EmailId Already exists",
                    success: false,
                    err: null
                })
            }
            else {
                res.send({
                    msg: "",
                    success: true,
                    err: null
                })
            }
        })
        .catch((err) => {
            res.json(console.log("Error:" + err));
        })
})



router.route("/addToCart/:userId/:itemId").post((req, res) => {
    User.updateOne({ _id: req.params.userId }, { $push: { cartItems: { productId: req.params.itemId, orderQuantity: 1 } } })
        .then(() => { res.json("product added to cart") })
        .catch((err) => { res.status(400).json(err) })
})

router.route("/removeFromCart/:userId/:itemId").post((req, res) => {
    User.updateOne({ _id: req.params.userId }, { $pull: { cartItems: { productId: mongoose.Types.ObjectId(req.params.itemId) } } })
        .then(() => { res.json("product removed from cart") })
        .catch((err) => { res.status(400).json(err) })
})

router.route("/inCartOrNot/:userId/:itemId").get((req, res) => {
    User.findOne({ _id: req.params.userId })
        .then((user) => {
            var returned = false
            if (user) {
                user.cartItems.map((product) => {
                    if (product.productId == req.params.itemId) {
                        res.json(true)
                        returned = true;
                    }
                })
                if (!returned)
                    res.json(false)
            }
            else
                res.json(false)
        })
        .catch((err) => { res.status(400).json("Error occured while checking in cart" + err) })
    // User.find({"cartItems":{$in:[req.params.itemId]}},{_id:req.params.userId})
    // .then((user) =>{
    //     if(user.length>0)
    //         res.json(true)
    //     else
    //         res.json(false)
    //     })
    // .catch((err) => {res.status(400).json("Error occured while checking in cart"+err)})
})

router.route("/cartItems/:userId").get((req, res) => {
    // console.log(req.params.userId);
    User.findOne({ _id: req.params.userId })
        .then(async (user) => {
            var cartIds = user.cartItems;
            var cartItems = []
            for (var i = 0; i < cartIds.length; i++) {
                await Product.findOne({ _id: cartIds[i].productId })
                    .then((product) => {
                        // orderQuantity=cartIds[i].orderQuantity
                        result = {
                            _id: product._id,
                            category: product.category,
                            subCategory: product.subCategory,
                            image: product.image,
                            brand: product.brand,
                            price: product.price,
                            description: product.description,
                            discount: product.discount,
                            quantity: product.quantity,
                            orderQuantity: cartIds[i].orderQuantity
                        }
                        console.log(result);
                        if (product) {
                            cartItems.push(result)
                        }
                        else {
                            User.updateOne({ _id: req.params.userId }, { $pull: { cartItems: { productId: cartIds[i].productId } } })
                                .then(() => { console.log("Removed a product from cart because product is deleted by admin") })
                                .catch((err) => { console.log("Error:" + err) })
                        }
                    })
                    .catch((err) => { res.status(400).json("Error while fetching cart Items:" + err) });
            }
            res.json(cartItems);
        });
})


router.route("/removeAllProductFromCartByUserId").post((req, res) => {
    User.updateOne({ _id: req.body.userId }, { $set: { cartItems: [] } })
        .then(() => {
            res.send("All items removed successfully");
        })
        .catch((err) => {
            res.status(400).send("Error occured while removing all the cart items" + err)
        })
})

router.route("/increaseQuantity").post((req, res) => {
    User.updateOne({ _id: req.body.userId, "cartItems.productId": req.body.productId }, { $inc: { "cartItems.$.orderQuantity": 1 } })
        .then(() => res.send("qunatity increased successfully"))
        .catch((err) => res.status(400).send("Error occured while increasing the quantity"))
})

router.route("/decreaseQuantity").post((req, res) => {
    User.updateOne({ _id: req.body.userId, "cartItems.productId": req.body.productId }, { $inc: { "cartItems.$.orderQuantity": -1 } })
        .then(() => res.send("qunatity decreased successfully"))
        .catch((err) => res.status(400).send("Error occured while decreasing the quantity"))
})

module.exports = router;