const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken.model");
const userModel = require("../models/user.model");

const addUser = async (req, res) => {
  const { password, email } = req.body;
  if (!validateEmail(email)) {
    res.status(403).send("invalid email");
  } else {
    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = new userModel({ ...req.body, password: hash });
      await newUser.save();
      res.status(201).send(newUser);
    } catch (err) {
      console.log(err);
      switch (err.code) {
        case 11000:
          res.status(403).send("Username or email already used");
          break;
        default:
          res.status(403).send(err);
      }
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
      const accessToken = jwt.sign(
        { user_name, id: foundUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
        }
      );
      const refreshToken = jwt.sign(
        { user_name, id: foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
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

const logoutUser = async (req, res) => {
  const deleteRes = await refreshTokenModel.deleteMany({
    user: req._id,
  });

  if (!deleteRes.ok) {
    res.status(401).send(`invalid user`);
  } else if (!deleteRes.n) {
    res.status(401).send(`refresh token already deleted`);
  } else {
    res.status(200).send(deleteRes);
  }
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = { addUser, loginUser, logoutUser };
