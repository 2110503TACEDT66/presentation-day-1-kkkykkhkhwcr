const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(protect, authorize("admin", "user"))
  .post(protect, authorize("admin"));

router
  .route("/:id")
  .get(protect, authorize("admin", "user"))
  .put(protect, authorize("admin"))
  .delete(protect, authorize("admin"));

module.exports = router;
