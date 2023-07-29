const crypto = require('crypto');

const generateOtp = (minDigits = 6, maxDigits = 6) => {
    return crypto.randomInt(10 ** (minDigits - 1), 10 ** (maxDigits).toString());
};

module.exports = generateOtp;