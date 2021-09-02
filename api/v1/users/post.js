const { createUser } = require("../../../services/userService")

module.exports = async (req, res) => {

  try {
    const result = await createUser(req.body)
    res.status(200).send({
      success: true,
      ...result,
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Sign-up failed",
      error: error.message,
    })
  }
}
