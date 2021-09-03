module.exports = (req, res) => {
  try {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to access this resource"
    });
  } catch (error) {
    
  }
}