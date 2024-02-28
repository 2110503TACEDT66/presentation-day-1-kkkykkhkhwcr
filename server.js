const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.js");
dotenv.config({ path: "./config/.env" });
const auth = require("./routes/auth.js");
const dentists = require("./routes/dentist.js");
const booked = require("./routes/booked.js");
const port = process.env.PORT;

app.use(express.json());
connectDB();

app.use("/", auth);
app.use("/dentists", dentists);
app.use("/booked", booked);
app.listen(port, () => {
  console.log(`Connect to localhost at port ${port}`);
});
