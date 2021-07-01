const express = require("express");
const {
  addUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const middleware = require("../middlewares");

module.exports = authRouter = express.Router();

authRouter.post(`/signup`, addUser);
authRouter.post(`/login`, loginUser);
authRouter.get(`/logout`, middleware.validateRequest, logoutUser);
