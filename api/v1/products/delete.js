const { deleteProductById, getProductById } = require("../../../services/productService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async(req, res) => {
    try {
        const id = req.params.id;

        const product = await getProductById(id);
        if(!product){
            return res.status(403).json({
                success: false,
                message: "This action is not possible"
            });    
        }
        if(product && product.sellerId!=req.user.id){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to perform this action"
            });
        }
        await deleteProductById(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        if( error instanceof DatabaseError ){
            return res.status(502).json({
                success: false,
                message: error.message
            });
        }
        console.log(error);
        return res.status(500).json({
        success: false,
        message: "Server Error"
        });
    }
}