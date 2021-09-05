const DatabaseError = require("../../../helpers/DatabaseError");
const { getProductById } = require("../../../services/productService");

module.exports = async(req, res) => {
  try {
    const id = req.params.id;

    const product = await getProductById(id);

    if(!product){
      return res.status(404).json({
        success: false,
        message: "The requested product does not exist"
      });
    }
    return res.status(200).json({
      success: true,
      product
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