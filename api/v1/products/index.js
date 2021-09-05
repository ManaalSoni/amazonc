const router = require("express").Router();
const { check } = require('express-validator');
const fileUpload = require("../../../middleware/fileUpload");

// create new product
router.post(
    "/", 
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
router.get("/", require("./get"));

// read featured products
router.get("/featured", require("./getFeatured"));

// read product by id
router.get("/:id", require("./getById"));

//read products by category
router.get("/category/:categoryName", require("./getByCategory"));

//read products by seller id
router.get("/seller/:sellerId", require("./getBySeller"));

// update product details
router.put(
    "/:id", 
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
router.delete("/:id", require("./delete"));

module.exports = router;