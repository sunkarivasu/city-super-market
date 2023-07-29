const { isEmpty, trimReqBody } = require('../utils/validatiors');
const { NAME_REGEX, EMAIL_REGEX } = require('../utils/regexes');


const validateAdminRegistration = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Name Validation
    if (isEmpty(req.body.name)) {
        errors.name = "Name is required";
    } else if (!NAME_REGEX.test(req.body.name)) {
        errors.name = "Name is invalid";
    } else if (req.body.name.length < 3 || req.body.name.length > 255) {
        errors.name = "Name must be between 3 to 255 characters";
    }

    // Email Validation
    if (isEmpty(req.body.email)) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors.email = "Email is invalid";
    }

    // Password Validation  TODO: Validate for strong password
    if (!isEmpty(req.body.password) && (req.body.password.length < 8 || req.body.password.length > 255)) {
        errors.password = "Password must be between 8 to 255 characters";
    }

    // allow password change validation
    if (req.body.allow_password_change && typeof req.body.allow_password_change !== 'boolean') {
        errors.allow_password_change = "Please provide valid data";
    }

    // Check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

const validateAdminLogin = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // email validation
    if (isEmpty(req.body.email)) {
        errors = { ...errors, email: 'Email is required' };
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors = { ...errors, email: 'Email is invalid' };
    }

    // password validation
    if (isEmpty(req.body.password)) {
        errors = { ...errors, password: 'Password is required' };
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation failed', err: errors });
    }

    next();
};

const validateUpdatePassword = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // password validation  TODO: do better validation
    if (isEmpty(req.body.password)) {
        errors = { ...errors, password: 'Password is required' };
    } else if (req.body.password.length < 8 || req.body.password.length > 255) {
        errors = { ...errors, password: 'Password must be between 8 and 255 characters' };
    }

    // check token
    if (isEmpty(req.headers.authorization)) {
        errors = { ...errors, token: 'Token is required' };
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation failed', err: errors });
    }

    next();
};

const validateForgotPassword = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // email validation
    if (isEmpty(req.body.email)) {
        errors = { ...errors, email: 'Email is required' };
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors = { ...errors, email: 'Email is invalid' };
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation failed', err: errors });
    }

    next();
};

const validateOtp = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Email Validation
    if (isEmpty(req.body.email)) {
        errors = { ...errors, email: 'Email is required' };
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors = { ...errors, email: 'Email is invalid' };
    }

    // OTP Validation
    if (isEmpty(req.body.otp)) {
        errors = { ...errors, otp: 'OTP is required' };
    }

    // OTP Hash validation
    if (isEmpty(req.body.otp_hash)) {
        errors = { ...errors, otp_hash: 'OTP hash is required' };
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation failed', err: errors });
    }

    next();
};

const validateResetPassword = (req, res, next) => {
    let errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Email Validation
    if (isEmpty(req.body.email)) {
        errors = { ...errors, email: 'Email is required' };
    } else if (!EMAIL_REGEX.test(req.body.email)) {
        errors = { ...errors, email: 'Email is invalid' };
    }

    // Password Validation  TODO: do better validation
    if (isEmpty(req.body.password)) {
        errors = { ...errors, password: 'Password is required' };
    } else if (req.body.password.length < 8 || req.body.password.length > 255) {
        errors = { ...errors, password: 'Password must be between 8 and 255 characters' };
    }

    // OTP Validation
    if (isEmpty(req.body.otp)) {
        errors = { ...errors, otp: 'OTP is required' };
    }

    // OTP Hash validation
    if (isEmpty(req.body.otp_hash)) {
        errors = { ...errors, otp_hash: 'OTP hash is required' };
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation failed', err: errors });
    }

    next();
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Forbidden' });
    }

    next();
};


module.exports = {
    validateAdminRegistration,
    validateAdminLogin,
    validateUpdatePassword,
    validateForgotPassword,
    validateOtp,
    validateResetPassword,
    isSuperAdmin
};