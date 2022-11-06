const { Router } = require("express");
const { createUser } = require("./controllers/users/createUser");
const { deleteUser } = require("./controllers/users/deleteUser");
const { getUserDetail } = require("./controllers/users/getUserDetail");
const { getUsers } = require("./controllers/users/getUsers");
const { getAllUsers } = require("./controllers/users/getAllUsers");
const { auth0db } = require("./controllers/users/auth0db");
const { updateUser } = require("./controllers/users/updateUser");
const { changeRolUser } = require("./controllers/users/changeRolUser");

// Middlewares
const { isAuthenticated } = require("./middlewares/auth");
const { isSuperAdmin } = require("./middlewares/superAdmin");

const router = Router();

router.get("/", isAuthenticated, getUsers);

router.get("/all", isAuthenticated, isSuperAdmin, getAllUsers);

router.post("/auth0", auth0db);

router.get("/:id", getUserDetail);

router.post("/", createUser);

router.put("/", updateUser);

router.put("/:id", isAuthenticated, isSuperAdmin, changeRolUser);

router.delete("/", deleteUser);

module.exports = router;
