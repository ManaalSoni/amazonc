const { validationResult } = require('express-validator');
const { editProductById, getProductById } = require("../../../services/productService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg
      });
    }

    const product = await getProductById(req.params.id);
    if(product && product.sellerId!=req.user.id){
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this action"
      })
    }

    await editProductById(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: `Product edited successfully`
    })
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