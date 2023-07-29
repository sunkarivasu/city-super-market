const crypto = require('crypto');

const generateOtpHash = (otp, verifier, expiryTimeInSeconds = 300) => {
    try {
        const expiryTime = Date.now() + expiryTimeInSeconds * 1000;

        const message = `${otp}.${verifier}.${expiryTime}`;

        return crypto.createHmac('sha256', process.env.OTP_SECRET)
            .update(message)
            .digest('hex') + '.' + expiryTime;
    } catch (err) {
        console.error(`⚡[server][AuthUtils][generateOtpHash] Error while generating OTP hash:`, err);
        return false;
    }
}

module.exports = generateOtpHash;