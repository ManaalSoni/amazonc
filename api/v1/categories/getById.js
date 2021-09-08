const { getCategoryById } = require("../../../services/categoryService");

module.exports = async(req, res) => {
    try {
        const category = await getCategoryById(req.params.id);
        if(!category){
            return res.status(404).json({
              success: false,
              message: "The requested category does not exist"
            });
        }
        return res.status(200).json({
            success: true,
            category: category.name
        })
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