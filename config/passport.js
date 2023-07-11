var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require("../models/user.model");
var Admin = require("../models/admin.model");


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        if (jwt_payload?.role == 'admin') {
            console.log("Admin", jwt_payload)
            Admin.findOne({ email: jwt_payload.email }, function (err, admin) {
                if (err) {
                    return done(err, false);
                }
                if (admin) {
                    return done(null, admin);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });
        } else {
            User.findOne({ id: jwt_payload.id }, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });
        }
    }));

}