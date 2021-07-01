const express = require("express");
const { followUser, unfollowUser } = require("../controllers/user.controller");
const middleware = require("../middlewares");

const userRouter = express.Router();

userRouter.post("/follow", middleware.validateRequest, followUser);
userRouter.post("/unfollow", middleware.validateRequest, unfollowUser);

module.exports = userRouter;
