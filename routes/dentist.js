const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.js");

router.route("/").get(protect, authorize()).post(protect, authorize());
router
  .route("/:id")
  .get(protect, authorize())
  .put(protect, authorize())
  .delete(protect, authorize());

module.exports = router;
