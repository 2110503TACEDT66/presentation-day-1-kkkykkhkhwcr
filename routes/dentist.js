const express = require("express");
const router = express.Router();
const {
  getDentist,
  getDentists,
  createDentist,
  deleteDentist,
  updateDentist,
} = require("../controllers/dentist.js");
const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(protect, authorize("admin", "user"), getDentists)
  .post(protect, authorize("admin"), createDentist);

router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);

module.exports = router;
