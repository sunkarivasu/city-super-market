const { isEmpty, trimReqBody } = require('../utils/validations');
const { EMAIL_REGEX } = require('../utils/constants');

const validateAdminLogin = (req, res, next) => {
    errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Email Validation
    if (isEmpty(req.body.email)) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors.email = "Email is invalid";
    }

    // Password Validation
    if (isEmpty(req.body.password)) {
        errors.password = "Password is required";
    } else if (req.body.password.length < 6) {
        errors.password = "Password must be atleast 6 characters";
    } else if (req.body.password.length > 255) {
        errors.password = "Password must be atmost 255 characters";
    }

    // Check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

module.exports = {
    validateAdminLogin
};