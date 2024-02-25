const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.js");
dotenv.config({ path: "./config/.env" });
const auth = require("./routes/auth.js");
const port = process.env.PORT;
connectDB();

app.listen(port, () => {
  console.log(`Connect to localhost at port ${port}`);
});
