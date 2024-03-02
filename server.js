const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/db.js");
dotenv.config({ path: "./config/.env" });
const auth = require("./routes/auth.js");
const dentists = require("./routes/dentist.js");
const booked = require("./routes/booked.js");
const port = process.env.PORT;
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 100000,
});
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

app.use("/", auth);
app.use("/dentists", dentists);
app.use("/booked", booked);
app.listen(port, () => {
  console.log(`Connect to localhost at port ${port}`);
});
