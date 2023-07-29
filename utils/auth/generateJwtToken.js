const jwt = require('jsonwebtoken');

const generateJwtToken = payload => new Promise((resolve, reject) => {
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE },
        (err, token) => {
            if (err) {
                console.error(`⚡[server][AuthUtils][generateJwtToken] Error while generating token:`, err);
                return reject({ status: 500, msg: 'Internal Server Error' });
            }
            return resolve(`Bearer ${token}`);
        }
    );
});

module.exports = generateJwtToken;