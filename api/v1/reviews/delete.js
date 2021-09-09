const { deleteReview } = require("../../../services/reviewService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async(req, res) => {
    try {
        if(req.user.id != req.body.userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }
        await deleteReview(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Review removed successfully"
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