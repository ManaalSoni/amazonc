function typeCheck(req, res, next) {
  let price = req.body.price;
  let quantity = req.body.quantity;
  let discount_rate = req.body.discount_rate;
  let condition = req.body.condition;

  if (price != undefined) {
    price = Number(price);
    if (price <= 0) {
      res.status(200).send({
        success: false,
        message: "invalid field price",
      });
      return;
    } else req.body.price = price;
  }
  if (quantity != undefined) {
    quantity = Number(quantity);
    if (quantity <= 0) {
      res.status(200).send({
        success: false,
        message: "invalid field quantity",
      });
      return;
    } else req.body.quantity = quantity;
  }

  if (discount_rate != undefined) {
    discount_rate = Number(discount_rate);
    if (discount_rate < 0 || discount_rate > 100) {
      res.status(200).send({
        success: false,
        message: "invalid field discount_rate",
      });
      return;
    } else req.body.discount_rate = discount_rate;
  }

  if (condition != undefined) {
    condition = Number(condition);
    req.body.condition = condition >= 0 ? 1 : -1;
  }

  next();
}

module.exports = typeCheck;
