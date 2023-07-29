const crypto = require('crypto');

const verifyOtpHash = (otp, verifier, otpHash, callback) => {
    try {
        const [hash, expiryTime] = otpHash.split('.');

        if (Date.now() > parseInt(expiryTime, 10)) return callback('OTP expired');

        const message = `${otp}.${verifier}.${expiryTime}`;

        const newHash = crypto.createHmac('sha256', process.env.OTP_SECRET)
            .update(message)
            .digest('hex');

        if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(newHash))) return callback('Invalid OTP');

        return callback('');
    } catch (err) {
        console.error(`⚡[server][AuthUtils][verifyOtpHash] Error verifying OTP hash:`, err);
        return callback('Internal server error');
    }
};

module.exports = verifyOtpHash;