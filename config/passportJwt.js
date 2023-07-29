const {
    Strategy,
    ExtractJwt
} = require('passport-jwt');

const Admin = require("../models/admin");


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(new Strategy(opts, async (payload, done) => {
        try {
            if (payload.role === 'admin' || payload.role === 'super_admin') {
                const admin = await Admin.findById(payload.id);
                if (admin && admin.allow_password_change) {
                    return done(null, false);
                }
                if (admin) {
                    return done(null, {
                        id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role
                    });
                } else {
                    return done(null, false);
                }
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.error('⚡[server][passportJwt] Error while Authenticating:', err);
            return done(err, false);
        }
    }))
};