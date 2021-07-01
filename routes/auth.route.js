const express = require("express");
const { addUser, loginUser } = require("../controllers/user.controller");

module.exports = authRouter = express.Router();

authRouter.post(`/signup`, addUser);
authRouter.post(`/login`, loginUser);
