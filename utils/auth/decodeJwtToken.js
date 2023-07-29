const jwt = require('jsonwebtoken');

const decodeJwtToken = token => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error(`⚡[server][AuthUtils][decodeJwtToken] Error while decoding token:`, err);
        return false;
    }
}

module.exports = decodeJwtToken;