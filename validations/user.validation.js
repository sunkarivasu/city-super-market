const { isEmpty, trimReqBody } = require("../utils/helpers/validation");
const { NAME_REGEX, EMAIL_REGEX, MOBILE_REGEX } = require("../utils/helpers/constants");

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

const validateUserUpdate = (req, res, next) => {
    const errors = {};

    // trim the input fields
    req.body = trimReqBody(req.body);

    // Validate Name
    if (!isEmpty(req.body.name)) {
        if (req.body.name.length < 3 || req.body.name.length > 255) {
            errors.name = "Name must be between 3 and 255 characters";
        } else if (!NAME_REGEX.test(req.body.name)) {
            errors.name = "Name must contain only letters and spaces";
        }
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
    if (!isEmpty(req.body.password)) {
        if (req.body.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
    }

    // Validate Address
    if (!isEmpty(req.body.address)) {
        if (!Array.isArray(req.body.address)) {
            errors.address = "Address must be an array";
        } else {
            req.body.address.forEach(address => {
                if (isEmpty(address.doorNumber)) {
                    errors.address = "Door Number is required";
                }
                if (isEmpty(address.streetName)) {
                    errors.address = "Street Name is required";
                }
                if (isEmpty(address.village)) {
                    errors.address = "Village/City is required";
                }
                if (isEmpty(address.mandal)) {
                    errors.address = "Mandal is required";
                }
                if (isEmpty(address.pincode)) {
                    errors.address = "Pincode is required";
                } else if (address.pincode.length !== 6) {
                    errors.address = "Pincode must be 6 digits";
                }
            });
        }
    }

    // Validate CartItems
    if (!isEmpty(req.body.cartItems)) {
        req.body.cartItems.forEach(cartItem => {
            if (isEmpty(cartItem.productId)) {
                errors.cartItems = "Product Id is required";
            }

            if (isEmpty(cartItem.quantity)) {
                errors.cartItems = "Quantity is required";
            }

            if (isEmpty(cartItem.orderQuantity)) {
                errors.cartItems = "Order Quantity is required";
            } else if (cartItem.orderQuantity < 0) {
                errors.cartItems = "Order Quantity must be greater than 0";
            }
        });
    }

    // check if there are any errors
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

module.exports = {
    checkIsAdmin,
    validateUserRegister,
    validateUserLogin,
    checkIsAdminOrSelf,
    validateUserUpdate
};