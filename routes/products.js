const router = require("express").Router();
const passport = require("passport");
const { checkIsAdmin } = require("../validations/user.validation");
const { validateProduct } = require("../validations/product.validation");

// Models
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");


// route    :: GET /api/products
// desc     :: Get all products
// access   :: Public
router.get(
    '/',
    (req, res) => {
        Product.find()
            .then(products => res.json({ msg: "Products fetched successfully", data: products }))
            .catch(err => {
                console.error(`⚡[server][productRoute][get /] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            })
    }
);

// route    :: GET /api/products/:id
// desc     :: Get product by id
// access   :: Public
router.get(
    '/:id',
    (req, res) => {
        Product.findById(req.params.id)
            .then(product => {
                if (!product) {
                    return res.status(404).json({ msg: "Product not found" });
                }

                return res.json({ msg: "Product fetched successfully", data: product })
            })
            .catch(err => {
                console.error(`⚡[server][productRoute][get /:id] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            })
    }
);

// route    :: POST /api/products
// desc     :: Create a new product
// access   :: Admin
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkIsAdmin,
    validateProduct,
    (req, res) => {
        // Check Category exists
        Category.findById(req.body.categoryId)
            .then(category => {
                if (!category) {
                    return res.status(404).json({ msg: "Category not found" });
                }

                // Check subCategory exists
                if (!category.subCategoryList.includes(req.body.subCategory)) {
                    return res.status(404).json({ msg: "Sub Category not found" });
                }

                // TODO: Check if product already exists

                // Create new product
                let newProduct = {
                    categoryId: req.body.categoryId,
                    subCategory: req.body.subCategory,
                    image: req.body.image,
                    brand: req.body.brand,
                    name: req.body.name,
                    variants: req.body.variants,
                    quantityType: req.body.quantityType
                };

                req.body.productId && (newProduct.productId = req.body.productId);
                req.body.description && (newProduct.description = req.body.description);
                req.body.discount && (newProduct.discount = req.body.discount);
                req.body.discountType && (newProduct.discountType = req.body.discountType);
                req.body.isAvailable && (newProduct.isAvailable = req.body.isAvailable);

                newProduct = new Product(newProduct);

                newProduct.save()
                    .then(product => res.json({ msg: "Product created successfully", data: product }))
                    .catch(err => {
                        console.error(`⚡[server][productRoute][post /] Error :: ${err}`);
                        return res.status(500).json({ msg: "Internal server error" });
                    });
            })
            .catch(err => {
                console.error(`⚡[server][productRoute][post /] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            });
    }
);

// route    :: GET /api/products/topProductsByCategory/:count
// desc     :: Get top ${count} products by category
// access   :: Public
router.get(
    '/topProductsByCategory/:count',
    (req, res) => {
        Category.find()
            .then(async categories => {
                if (!categories.length) {
                    return res.status(404).json({ msg: "Categories not found" });
                }

                let topProductsByCategory = [];

                for (let i = 0; i < categories.length; i++) {
                    const products = await Product.find({ categoryId: categories[i]._id })
                    .sort({createdAt: -1})
                    .limit(parseInt(req.params.count))

                    if (products.length) {
                        topProductsByCategory.push({
                            category: categories[i].categoryName,
                            products: products
                        });
                    }
                };

                return res.json({ msg: "Top products by category fetched successfully", data: topProductsByCategory });
            })
            .catch(err => {
                console.error(`⚡[server][productRoute][get /topProductsByCategory/:count] Error :: ${err}`);
                return res.status(500).json({ msg: "Internal server error" });
            });
    }
);


router.route("/category/:categoryName").get((req, res) => {
    // console.log(req.params.categoryName);
    Product.find({ category: req.params.categoryName })
        .then(products => res.json(products))
        .catch(err => res.status(400).json("Error" + err));
});



router.route("/searchProductDetailsToUpdate/:category/:subCategory/:productName").get((req, res) => {
    Product.find({ category: req.params.category, subCategory: req.params.subCategory, brand: req.params.productName })
        .then((products) => { res.json(products) })
        .catch(() => { res.status(400).json("Error while searching product details to update:" + err) });
})

router.route("/updateProductDetails/").put((req, res) => {
    Product.findByIdAndUpdate(req.body._id, { category: req.body.category, subCategory: req.body.subCategory, brand: req.body.brand, quantity: req.body.quantity, price: req.body.price, discount: req.body.discount, image: req.body.image, description: req.body.description })
        .then(() => { console.log("Product updated successfully"); res.send({}) })
        .catch((err) => { console.log("Error Occured While updating prodcut details"); })
    // Product.updateOne({category:req.body.category,subCategory:req.body.subCategory,brand:req.body.brand},{$set:{quantity:req.body.quantity,price:req.body.price,discount:req.body.discount,image:req.body.image,description:req.body.description}})
    // .then(() => {res.json("product updated")})
    // .catch(() => {res.status(400).json("Error occured while updating the product:"+err)});
});

router.route("/delete/:productId").delete((req, res) => {
    Product.findByIdAndDelete(req.params.productId)
        .then(() => {
            console.log("Producted Deleted: " + req.params.productId)
            Order.remove({ productId: req.params.productId })
                .then(() => { res.json("product deleted in the orders collection by admin"); })
                .catch((err) => { res.status(400).json("Error occured while deleting Order beacause of deleteing product") })
        })
        .catch((err) => res.status(400).json("Error occured while deleting product"));

})


router.route("/getProductsByCategory/:category").get((req, res) => {
    Product.find({ category: req.params.category })
        .then((products) => {
            res.json(products)
        })
        .catch((err) => res.status(400).json("Error occured while fetching products by category"))
})

router.route("/getProductsByCategoryAndSubCategory/:category/:subCategory").get((req, res) => {
    Product.find({ category: req.params.category, subCategory: req.params.subCategory })
        .then((products) => {
            res.json(products)
        })
        .catch((err) => res.status(400).json("Error occured while fetching products by category and sub category"))
})



module.exports = router;