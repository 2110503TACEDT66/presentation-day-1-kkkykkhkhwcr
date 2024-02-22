const express = require("express");
const app = express();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Connect to localhost at port ${port}`);
});
