const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

class middlewareClass {
  constructor() {
    this._defaults = [express.json(), morgan("tiny")];
  }
  get defaults() {
    return this._defaults;
  }
  set defaults(defaults) {
    this._defaults = defaults;
  }

  get validateRequest() {
    return (req, res, next) => {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401).send("NO TOKEN FOUND");
      } else {
        try {
          const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          req._id = user.id;
          next();
        } catch (error) {
          res.status(403).send(error);
        }
      }
    };
  }
}

const middleware = new middlewareClass();

module.exports = middleware;
