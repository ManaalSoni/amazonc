const router = require("express").Router();
const { check } = require('express-validator');
const fileUpload = require("../../../middleware/fileUpload");
const userAuth = require("../../../middleware/userAuth");

// create new product
router.post(
    "/", 
    userAuth,
    fileUpload,
    [
        check("name", "name is required").notEmpty(),
        check("category", "category is required").notEmpty(),
        check("price", "invalid field 'price'").notEmpty().isNumeric(),
        check("featured", "invalid field 'featured'").notEmpty().isBoolean()
    ],
    require("./post")
);

// read products list
router.get("/", userAuth, require("./get"));

// read featured products
router.get("/featured", userAuth, require("./getFeatured"));

// read product by id
router.get("/:id", userAuth, require("./getById"));

//read products by category
router.get("/category/:categoryName", userAuth, require("./getByCategory"));

//read products by seller id
router.get("/seller/:sellerId", userAuth, require("./getBySeller"));

// update product details
router.put(
    "/:id", 
    userAuth,
    fileUpload, 
    [
        check("name", "name is required").isEmpty(),
        check("category", "category is required").isEmpty(),
        check("price", "invalid field 'price'").optional().isNumeric(),
        check("featured", "invalid field 'featured'").optional().isBoolean()
    ],
    require("./put")
);

//delete product
router.delete("/:id", userAuth, require("./delete"));

module.exports = router;