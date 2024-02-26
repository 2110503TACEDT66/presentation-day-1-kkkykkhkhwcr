const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(protect, authorize("admin"))
  .post(protect, authorize("admin", "user"));
router
  .route("/:id")
  .get(protect, authorize("admin", "user"))
  .put(protect, authorize("admin", "user"))
  .delete(protect, authorize("admin", "user"));

module.exports = router;
