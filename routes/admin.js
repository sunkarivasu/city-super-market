const router = require('express').Router();
const jwt = require('jsonwebtoken');

// import validations
// const { validateAdminLogin } = require('../validations/admin.validation');

// import models
const Admin = require('../models/admin.model');


// route    :: POST /api/admin/login
// access   :: Public
// desc     :: Admin Login
router.post(
    '/login',
    // validateAdminLogin,
    (req, res) => {
        Admin.findOne({ email: req.body.email })
            .then(admin => {
                console.log("admin", admin)
                if (!admin || !admin.authenticate(req.body.password)) {
                    return res.status(401).json({ msg: 'Invalid Credentials' });
                }

                const jwtPayload = {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: 'admin'
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
//     // validateAdminLogin,
//     (req, res) => {
//         Admin.findOne({ email: req.body.email })
//             .then(admin => {
//                 if (admin) {
//                     return res.status(422).json({ msg: 'Admin already exists' });
//                 }

//                 const newAdmin = new Admin({
//                     name: req.body.name,
//                     email: req.body.email,
//                     password: req.body.password
//                 });

//                 newAdmin.save()
//                     .then(admin => res.json({ msg: 'Admin Registered Successfully', data: admin }))
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