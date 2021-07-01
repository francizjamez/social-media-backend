const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken.model");
const userModel = require("../models/user.model");

const addUser = async (req, res) => {
  const { password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({ ...req.body, password: hash });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    switch (err.code) {
      case 11000:
        res.status(403).send("Username or email already used");
        break;
      default:
        res.status(403).send(err);
    }
  }
};

const loginUser = async (req, res) => {
  const { user_name, password } = req.body;
  const foundUser = await userModel.findOne({ user_name });

  if (!foundUser) {
    res.status(403).send("USER DOES NOT EXIST");
  } else {
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      res.status(403).send("INVALID PASSWORD");
    } else {
      const accessToken = jwt.sign({ user_name, id: foundUser._id }, "secret");
      const refreshToken = jwt.sign(
        { user_name, id: foundUser._id },
        "refreshing secret"
      );
      const output = { access_token: accessToken, refresh_token: refreshToken };
      const newRefreshToken = new refreshTokenModel({
        token: refreshToken,
        user: foundUser._id,
      });
      await newRefreshToken.save();
      res.status(200).send(output);
    }
  }
};

module.exports = { addUser, loginUser };
