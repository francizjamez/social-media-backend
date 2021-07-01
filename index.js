//imports
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
//routers
const authRouter = require("./routes/auth.route");
//constants
const app = express();
const PORT = 3333;
//middlewares
app.use(morgan(`tiny`));
app.use(express.json());
//routes
app.use("/auth", authRouter);

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
