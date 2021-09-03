const { deleteProductById } = require("../../../services/productService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async(req, res) => {
    try {
        const id = req.params.id;

        await deleteProductById(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        if( error instanceof DatabaseError )
        return res.status(502).json({
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