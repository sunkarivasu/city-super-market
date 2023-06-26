const { trimReqBody, isEmpty } = require("../utils/validations");

const validateCategory = (req, res, next) => {
    errors = {};

    // Trim the inputs
    req.body = trimReqBody(req.body);

    // Category Name Validation
    if (isEmpty(req.body.categoryName)) {
        errors.categoryName = "Category Name is required";
    } else if (req.body.categoryName.length < 2 || req.body.categoryName.length > 255) {
        errors.categoryName = "Category Name must be between 2 and 255 characters";
    }

    // Category Image Validation
    if (isEmpty(req.body.categoryImage)) {
        errors.categoryImage = "Category Image is required";
    }

    // Sub Category List Validation
    if (isEmpty(req.body.subCategoryList)) {
        errors.subCategoryList = "Atleast one sub category is required";
    } else {
        req.body.subCategoryList.forEach((subCategory) => {
            if (isEmpty(subCategory)) {
                errors.subCategoryList = "SubCategory Item should not be empty";
            } else if (subCategory.length < 2 || subCategory.length > 255) {
                errors.subCategoryList = "Each SubCategory must be between 2 and 255 characters";
            }
        });
    }

    // Check if errors exist
    if (!isEmpty(errors)) {
        return res.status(422).json({ msg: 'Validation Failed', err: errors });
    }

    next();
};

module.exports = {
    validateCategory
};