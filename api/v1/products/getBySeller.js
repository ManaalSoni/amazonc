const DatabaseError = require("../../../helpers/DatabaseError");
const { getSellerProducts } = require("../../../services/productService");

module.exports = async(req,res) => {
    try {
        const products = await getSellerProducts(req.params.sellerId);
        if(!products){
            return res.status(200).json({
                success: true,
                products: []
            });
        }
        return res.status(200).json({
            success: true,
            products: products
        });
    } catch (error) {
        if( error instanceof DatabaseError )
        return res.status(400).json({
            success: false,
            message: error.message
        });
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Server Error"
        });
    }
}