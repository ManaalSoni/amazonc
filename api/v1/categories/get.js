const { getCategories } = require("../../../services/categoryService");

module.exports = async(req, res) => {
    try {
        const categories = await getCategories();
        return res.status(200).json({
            success: true,
            categories
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