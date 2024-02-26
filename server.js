const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.js");
dotenv.config({ path: "./config/.env" });
const auth = require("./routes/auth.js");
const dentists = require("./routes/dentist.js");
const booked = require("./routes/booked.js");
const port = process.env.PORT;
const bookSchema = require("./schema/booked.js");
const dentistSchema = require("./schema/dentist.js");
const userSchema = require("./schema/user.js");
connectDB();

app.use("/", auth);
app.use("/", dentists);
app.use("/", booked);

app.listen(port, () => {
  console.log(`Connect to localhost at port ${port}`);
});
