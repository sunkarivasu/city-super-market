const Product = require("../models/product.model");


const checkForOutOfStockProducts = (orderItems) => {
    return new Promise(async (resolve, reject) => {
        let listOfOutOfStockProducts = []
        let listOfNotFoundProducts = []
        let orderAmount = 0;
        let orderAmountAfterDiscount = 0
        for (const orderItem of orderItems) {
            await Product.findById(orderItem.productId)
                .then((product) => {
                    if (product) {
                        //checking for product's availability

                        const variants = product.variants;
                        const selectedVariant = variants.find((variant) => {
                            return variant.quantity === orderItem.quantity && variant.isAvailable === true
                        })
                        if (selectedVariant) {
                            console.log(product, orderItem);
                            console.log("19", selectedVariant.price * orderItem.orderQuantity);
                            orderAmount += selectedVariant.price * orderItem.orderQuantity
                            let priceAfterDiscountPerOneProduct = selectedVariant.discountType == 'amount' ? (selectedVariant.price - selectedVariant.discount) : ((100 - selectedVariant.discount) / 100 * selectedVariant.price)
                            orderAmountAfterDiscount += priceAfterDiscountPerOneProduct * orderItem.orderQuantity
                        }
                        else {
                            listOfOutOfStockProducts.push(orderItem.productId)
                        }
                    }
                    else {
                        listOfNotFoundProducts.push(orderItem.productId)
                    }
                })
                .catch((err) => {
                    // console.error(`⚡[server][ordersRoute][post /add][occurence::while checking finding product], Error :: ${err}`);
                    // res.status(500).send({ msg: "Internal Server Error" })
                    reject(err)
                })

        }
        console.log("46", listOfOutOfStockProducts);
        console.log("47", orderAmount, orderAmountAfterDiscount);
        resolve({
            listOfOutOfStockProducts: listOfOutOfStockProducts,
            listOfNotFoundProducts: listOfNotFoundProducts,
            orderAmount: orderAmount,
            orderAmountAfterDiscount: orderAmountAfterDiscount
        })
    })
}


const checkForOutOfStockProduct = (orderItem) => {
    return new Promise((resolve, reject) => {
        Product.findById(orderItem.productId)
            .then((product) => {
                var result = {
                    isOutOfStockProduct: false,
                    isProductNotFound: false,
                    itemAmount: 0,
                    itemAmountAfterDiscount: 0
                }
                if (product) {
                    //checking for product's availability
                    Product
                        .findOne({ "variants.quantity": orderItem.quantity, "variants.isAvailable": true })
                        .then((product) => {
                            if (product) {
                                result["itemAmount"] += product.price * orderItem.orderQuantity
                                let priceAfterDiscountPerOneProduct = product.discountType == 'amount' ? (product.price - product.discount) : ((100 - product.discount) / 100 * product.price)
                                result["itemAmountafterDiscount"] = priceAfterDiscountPerOneProduct * orderItem.orderQuantity
                            }
                            else {
                                console.log("24", listOfOutOfStockProducts);
                                result["isOutOfStockProduct"] = true
                            }
                        })
                        .catch((err) => {
                            // console.error(`⚡[server][ordersRoute][post /add][occurence::while checking for product's availablity], Error :: ${err}`);
                            // res.status(500).send({ msg: "Internal Server Error" })
                            reject(err)
                        })
                }
                else {
                    result["isProductNotFound"] = true
                    listOfNotFoundProducts.push(orderItem.productId)
                }
            })
            .catch((err) => {
                // console.error(`⚡[server][ordersRoute][post /add][occurence::while checking finding product], Error :: ${err}`);
                // res.status(500).send({ msg: "Internal Server Error" })
                reject(err)
            })
        resolve(result)
    })
}
module.exports = {
    checkForOutOfStockProducts
}