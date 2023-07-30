const { trimReqBody, isEmpty } = require("../utils/helpers/validation");
const { QUANTITY_TYPES } = require("../utils/helpers/constants");

const validateProduct = (req, res, next) => {
    errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Product Id Validation
    if (!isEmpty(req.body.productId)) {
        if (req.body.productId.length < 3) {
            errors.productId = "Product Id must be atleast 3 characters";
        } else if (req.body.productId.length > 255) {
            errors.productId = "Product Id must be atmost 255 characters";
        }
    }

    // Category Id Validation
    if (isEmpty(req.body.categoryId)) {
        errors.categoryId = "Category Id is required";
    }

    // Sub Category Validation
    if (isEmpty(req.body.subCategory)) {
        errors.subCategory = "Sub Category is required";
    }

    // Image Validation
    if (isEmpty(req.body.image)) {
        errors.image = "Image is required";
    }

    // Brand Validation
    if (isEmpty(req.body.brand)) {
        errors.brand = "Brand is required";
    }

    // Name Validation
    if (isEmpty(req.body.name)) {
        errors.name = "Name is required";
    }

    // Description Validation
    if (!isEmpty(req.body.description)) {
        if (req.body.description.length < 3) {
            errors.description = "Description must be atleast 3 characters";
        } else if (req.body.description.length > 512) {
            errors.description = "Description must be atmost 512 characters";
        }
    }

    // Variants Validation
    if (isEmpty(req.body.variants)) {
        errors.variants = "Atleast one variant is required";
    } else {
        req.body.variants.forEach((variant) => {
            if (isEmpty(variant.price)) {
                errors.variants = "Price is required";
            } else if (variant.price <= 0) {
                errors.variants = "Price must be greater than 0";
            }
            if (isEmpty(variant.quantity)) {
                errors.variants = "Quantity is required";
            } else if (variant.quantity <= 0) {
                errors.variants = "Quantity must be greater than 0";
            }
            if (!isEmpty(variant.isSpecialOffer) && typeof variant.isSpecialOffer !== 'boolean') {
                errors.variants = "isSpecialOffer must be a boolean";
            }

            // Discount Validation
            if (!isEmpty(variant.discount)) {
                let discountType = 'amount';

                if (!isEmpty(variant.discountType)) {
                    discountType = variant.discountType.toLowerCase();

                    if (discountType !== 'percent' && discountType !== 'amount') {
                        errors.discountType = "Discount Type must be one of percent, amount";
                    }
                }

                if (discountType === 'percent') {
                    if (variant.discount < 0 || variant.discount >= 100) {
                        errors.discount = "Discount must be between 0 and 100";
                    }
                } else if (discountType === 'amount') {
                    if (variant.discount < 0) {
                        errors.discount = "Discount must be greater or equal to 0";
                    }
                    else if (variant.discount >= variant.price) {
                        errors.discount = "Discount can't be greater than or equal to Price";
                    }
                }

                // isAvailable Validation
                if (!isEmpty(variant.isAvailable) && typeof variant.isAvailable !== 'boolean') {
                    errors.isAvailable = "isAvailable must be a boolean";
                }
            }
        });
    }

    // Quantity Type Validation
    if (isEmpty(req.body.quantityType)) {
        errors.quantityType = "Quantity Type is required";
    } else if (!QUANTITY_TYPES.includes(req.body.quantityType)) {
        errors.quantityType = "Quantity Type must be one of " + QUANTITY_TYPES.join(", ");
    }

    // Check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

module.exports = {
    validateProduct
};