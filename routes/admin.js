const router = require('express').Router();
const jwt = require('jsonwebtoken');

// import validations
const { validateAdminLogin } = require('../validations/admin.validation');

// import models
const User = require('../models/user.model');


// route    :: POST /api/admin/login
// access   :: Public
// desc     :: Admin Login
router.post(
    '/login',
    validateAdminLogin,
    (req, res) => {
        User.findOne({ emailId: req.body.email, isAdmin: true })
            .then(user => {
                if (!user || !user.authenticate(req.body.password)) {
                    return res.status(401).json({ msg: 'Invalid Credentials' });
                }

                const jwtPayload = {
                    id: user._id,
                    name: user.name,
                    email: user.emailId,
                    isAdmin: user.isAdmin,
                    phoneNumber: user.phoneNumber
                };

                jwt.sign(
                    jwtPayload,
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) {
                            console.error('[server][adminRoute][login] Error while generating token', err);
                            return res.status(500).json({ msg: 'Internal Server Error' });
                        }

                        return res.json({
                            msg: 'Admin Logged In Successfully',
                            data: {
                                token: `Bearer ${token}`
                            }
                        });
                    }
                );
            })
            .catch(err => {
                console.error('[server][adminRoute][login] Error while finding admin', err);
                return res.status(500).json({ msg: 'Internal Server Error' });
            });
    }
);

// // TODO: Delete this route
// // route    :: POST /api/admin/register
// // access   :: Public
// // desc     :: Admin Register
// router.post(
//     '/register',
//     validateAdminLogin,
//     (req, res) => {
//         User.findOne({ emailId: req.body.email, isAdmin: true })
//             .then(user => {
//                 if (user) {
//                     return res.status(422).json({ msg: 'Admin already exists' });
//                 }

//                 const newUser = new User({
//                     name: req.body.name,
//                     emailId: req.body.email,
//                     password: req.body.password,
//                     phoneNumber: req.body.phoneNumber,
//                     isAdmin: true
//                 });

//                 newUser.save()
//                     .then(user => res.json({ msg: 'Admin Registered Successfully', data: user }))
//                     .catch(err => {
//                         console.error('[server][adminRoute][register] Error while saving admin', err);
//                         return res.status(500).json({ msg: 'Internal Server Error' });
//                     });
//             })
//             .catch(err => {
//                 console.error('[server][adminRoute][register] Error while finding admin', err);
//                 return res.status(500).json({ msg: 'Internal Server Error' });
//             });
//     }
// );

module.exports = router;