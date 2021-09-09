const { getReviews } = require("../../../services/reviewService")

module.exports = async(req, res) => {
    try {
        const reviews = await getReviews(req.params.id);
        return res.status(200).json({
            success: true,
            reviews
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