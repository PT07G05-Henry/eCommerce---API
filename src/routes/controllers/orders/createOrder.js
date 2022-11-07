const { Order, User, Product, Op } = require("../../../db");
const axios = require("axios");
require("dotenv").config();
const { ACCESS_TOKEN_TEST_MP } = process.env;

const createOrder = async (req, res, next) => {
  //falta escribir acá
  try {
    //console.log(ACCESS_TOKEN_TEST_MP);
    const { payment_id } = req.query;
    //console.log(payment_id);
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN_TEST_MP}`,
        },
      }
    );
    //console.log(response.data.status);
    const products = response.data.additional_info.items;
    const total_price = Number(response.data.transaction_amount);
    const { sid } = response.data.metadata;

    const userDb = await User.findOne({ where: { sid } });
    const productsDb = await Product.findAll({
      where: { id: { [Op.in]: products.map((e) => e.id) } },
    });

    // //create order
    const order = await Order.create({
      //LUEGO CAMBIAR PARA VERIFICAR EL STATUS DE MP
      status: response.data.status,
      total_price,
    });
    // // user - order relation
    console.log("response.data.metadata", response.data.metadata);
    await userDb.addOrder(order);

    const op = await order.addProducts(productsDb);

    products.forEach(
      async (p, i) =>
        await op[i].update({ product_quantity: parseInt(p.quantity) })
    );

    const result = await Order.findOne({
      where: { id: order.dataValues.id },
      include: [User, Product],
    });
    // console.log(result.dataValues);

    //return res.send("Close this window!");

    req.query.responseMP = `https://localhost:3000/payment?userId=${userDb.dataValues.id}&orderId=${order.dataValues.id}&status=${response.data.status}&total_price=${total_price}`;
    // res.redirect("/email/send");
    // res.redirect(`https://localhost:3000/payment?userId=${userDb.dataValues.id}&orderId=${order.dataValues.id}&status=${response.data.status}&total_price=${total_price}`);
    const infoMail = {
      subject: `${payment_id} order`,
      type: "newBuyCart",
      message: `${result.user.dataValues.first_name} this are your products`,
      directionAddress: `Home`,
      email: `${result.user.dataValues.email}`,
      totalPrice: `${result.dataValues.total_price}`,
      products: result.dataValues.products.map((p) => p.dataValues),
    };
    req.body = { ...req.body, ...infoMail };
    console.log("req.bodyproducts", req.body.products);
    //console.log("infoMail", infoMail);
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message, message: "Cant create order" });
  }
};

module.exports = { createOrder };
