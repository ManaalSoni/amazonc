const { getFeaturedProducts } = require("../../../services/productService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async(req, res) => {
    try {
        
        const featuredProducts = await getFeaturedProducts();
        if(!featuredProducts){
            return res.status(200).json({
                success: true,
                products: []
            });
        }
        return res.status(200).json({
            success: true,
            products: featuredProducts
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