//imports
const express = require("express");
const mongoose = require("mongoose");
const middleware = require("./middlewares");
require("dotenv").config();
//routers
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
//constants
const app = express();
const PORT = 3333;
//middlewares
app.use([...middleware.defaults]);
//routes
app.use("/auth", authRouter);
app.use("/user", userRouter);

//connections
app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.once("open", () => {
  console.log(`connected to database`);
});
