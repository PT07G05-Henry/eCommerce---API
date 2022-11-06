const { Router } = require("express");
const { createOrder } = require("./controllers/orders/createOrder");
const { deleteOrder } = require("./controllers/orders/deleteOrder");
const { getOrderDetail } = require("./controllers/orders/getOrderDetail");
const { getOrders } = require("./controllers/orders/getOrders");
const { updateOrder } = require("./controllers/orders/updateOrder");
const { getAllOrders } = require("./controllers/orders/getAllOrders");

//Middlewares
const { isAuthenticated } = require("./middlewares/auth");
const { isUser } = require("./middlewares/user");
const { isOwner } = require("./middlewares/owner");
const { isSuperAdmin } = require("./middlewares/superAdmin");
const { isSuperAdminOrAdmin } = require("./middlewares/superAdminOrAdmin")
const dataMercado = require("./middlewares/dataMercado.js");
const checkStock = require("./middlewares/checkStock.js");
const { createLinkMP } = require("./middlewares/mercado.js");

const router = Router();

// Just for superadmin
router.get("/all", isAuthenticated, isSuperAdminOrAdmin, getAllOrders);

//router.get("/:id", isAuthenticated, getOrderDetail);

//router.post("/", isAuthenticated, isUser, createOrder);

router.post(
  "/",
  isAuthenticated,
  isUser,
  checkStock,
  dataMercado,
  createLinkMP
);

router.get("/mercadoResponse", createOrder);

// For admin or user dashboard
router.get("/", isAuthenticated, getOrders);

router.put("/", updateOrder);

router.delete("/", deleteOrder);

module.exports = router;
