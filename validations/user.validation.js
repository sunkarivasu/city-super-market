const { isEmpty, trimReqBody } = require("../utils/validations");
const { NAME_REGEX, EMAIL_REGEX, MOBILE_REGEX } = require("../utils/constants");

const checkIsAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ msg: "Unauthorized" });
    }
};

const validateUserRegister = (req, res, next) => {
    const errors = {};

    // trim the input fields
    req.body = trimReqBody(req.body);

    // Validate Name
    if (isEmpty(req.body.name)) {
        errors.name = "Name is required";
    } else if (req.body.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
    } else if (req.body.name.length > 255) {
        errors.name = "Name must be at most 255 characters";
    } else if (!NAME_REGEX.test(req.body.name)) {
        errors.name = "Name must contain only letters and spaces";
    }

    // Validate Email
    if (!isEmpty(req.body.email)) {
        if (req.body.email.length > 255) {
            errors.email = "Email must be at most 255 characters";
        } else if (!EMAIL_REGEX.test(req.body.email)) {
            errors.email = "Email is invalid";
        }
    }

    // Validate Password
    // TODO: Add strong password validation
    if (isEmpty(req.body.password)) {
        errors.password = "Password is required";
    } else if (req.body.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    // Validate Phone Number
    if (isEmpty(req.body.phoneNumber)) {
        errors.phoneNumber = "Phone Number is required";
    } else if (!MOBILE_REGEX.test(req.body.phoneNumber)) {
        errors.phoneNumber = "Phone Number is invalid";
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    };

    next();
};

const validateUserLogin = (req, res, next) => {
    const errors = {};

    // trim the input fields
    req.body = trimReqBody(req.body);

    // Validate Phone Number
    if (isEmpty(req.body.phoneNumber)) {
        errors.phoneNumber = "Phone Number is required";
    } else if (!MOBILE_REGEX.test(req.body.phoneNumber)) {
        errors.phoneNumber = "Phone Number is invalid";
    }

    // Validate Password
    if (isEmpty(req.body.password)) {
        errors.password = "Password is required";
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    };

    next();
};

const checkIsAdminOrSelf = (req, res, next) => {
    if (req.user.isAdmin || req.user.id === req.params.id) {
        next();
    } else {
        res.status(401).json({ msg: "Unauthorized" });
    }
};

const checkIsSelf =()=>{
    if (req.user.id === req.params.id) {
        next();
    } else {
        res.status(401).json({ msg: "Unauthorized" });
    }
}

module.exports = {
    checkIsAdmin,
    validateUserRegister,
    validateUserLogin,
    checkIsAdminOrSelf,
    checkIsSelf
};