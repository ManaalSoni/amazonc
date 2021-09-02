const { createUser } = require("../../../services/userService")

module.exports = () => {
  return (req, res) => {
    createUser(req.body)
      .catch((error) =>
        res.status(400).send({
          success: false,
          message: "sigup failed",
          error: error.message,
        })
      )
      .then((result) =>
        res.status(200).send({
          success: true,
          ...result,
        })
      )
  }
}
