const express = require("express");
const { Product, Category, User } = require("../db");
const categoryRoute = require("./categories");
const commentRoute = require("./comments");
const deliveryRoute = require("./deliveries");
const orderRoute = require("./orders");
const paymentRoute = require("./payments");
const productRoute = require("./products");
const userRoute = require("./users");
const emailRoute = require("./email");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = express();
router.use(express.json());

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/categories", categoryRoute);

router.use("/comments", commentRoute);

router.use("/deliveries", deliveryRoute);

router.use("/orders", orderRoute);

router.use("/payments", paymentRoute);

router.use("/products", productRoute);

router.use("/users", userRoute);

router.use("/email", emailRoute);

router.all("*", (req, res) => {
  res.redirect("/");
});
router;

module.exports = router;
