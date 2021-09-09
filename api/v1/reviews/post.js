const { addReview } = require("../../../services/reviewService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async(req, res) => {
    try {
        await addReview(req.params.id, req.body, {
            userId: req.user.id,
            userFullName: req.user.fullName
        });
        return res.status(200).json({
            success: true,
            message: "Review added successfully"
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