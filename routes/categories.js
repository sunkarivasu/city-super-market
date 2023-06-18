const router = require("express").Router();
const passport = require("passport");
const { checkIsAdmin } = require("../validations/user.validation");
const { validateCategory } = require("../validations/category.validation");

// import models
const Category = require("../models/category.model");

// route    :: GET /api/categories
// desc     :: Get all categories
// access   :: Public
router.get(
    '/',
    (req, res) => {
        Category.find()
            .then(categories => res.json({ msg: "Categories fetched successfully", data: categories }))
            .catch(err => {
                console.error(`⚡[server][categoryRoute][get /] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            });
    }
);

// route    :: GET /api/categories/:id
// desc     :: Get category by id
// access   :: Public
router.get(
    '/:id',
    (req, res) => {
        Category.findById(req.params.id)
            .then(category => {
                if (!category) {
                    return res.status(404).json({ msg: "Category not found" });
                }

                return res.json({ msg: "Category fetched successfully", data: category })
            })
            .catch(err => {
                console.error(`⚡[server][categoryRoute][get /:id] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            });
    }
);

// route    :: POST /api/categories
// desc     :: Create a new category
// access   :: Admin
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkIsAdmin,
    validateCategory,
    (req, res) => {
        const newCategory = new Category({
            categoryName: req.body.categoryName,
            categoryImage: req.body.categoryImage,
            subCategoryList: req.body.subCategoryList
        });

        newCategory.save()
            .then(category => res.json({ msg: "Category created successfully", data: category }))
            .catch(err => {
                console.error(`⚡[server][categoryRoute][post /] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            });
    }
);


router.route("/getCategoryDetails/:categoryName").get((req, res) => {
    Category.findOne({ categoryName: req.params.categoryName })
        .then((categories) => { res.send(categories) })
        .catch((err) => { res.status(400).send("Error occured while fetching catagory details") });
})

router.route("/getCategories").get((req, res) => {
    Category.find({}, { _id: 0, categoryName: 1 })
        .then((categories) => res.json(categories))
        .catch((err) => { res.status(400).json("Error while fetching categories:" + err) });
});

router.route("/updateCategoryDetails/").put((req, res) => {
    Category.updateOne({ categoryName: req.body.category }, { $set: { subCategoryList: req.body.subCategoryList, categoryImage: req.body.categoryImage } })
        .then(() => { res.json("Category updated successfully") })
        .catch(() => { res.status(400).json("Error:" + err) })
});

router.route("/getSubCategories/:categoryName").get((req, res) => {
    Category.findOne({ categoryName: req.params.categoryName }, { _id: 0, subCategoryList: 1 })
        .then((result) => { res.json(result.subCategoryList) })
        .catch((err) => { res.status(400).json("Error:" + err) })
});




router.route("/getCategoryDetails/:categoryName").get((req, res) => {
    Category.findOne({ categoryName: req.params.categoryName })
        .then((result) => { res.json(result) })
        .catch((err) => { res.status(400).json("Error:" + err) })
});

router.route("/deleteCategory/:categoryName").delete((req, res) => {
    Category.deleteOne({ categoryName: req.params.categoryName })
        .then(() => { res.json("Category Deleted") })
        .catch((err) => { res.status(400).json("Error:" + err) });
})

module.exports = router;