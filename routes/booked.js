const express = require("express");

const {
  getBookingsByRole,
  getBookingById,
  createBooking,
  updateBookingByUser,
  updateBookingByAdmin,
  deleteBookingByAdmin,
  deleteBookingByUser,
} = require("../controllers/booked.js");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(protect, authorize("admin", "user"), getBookingsByRole)
  .post(protect, authorize("user"), createBooking)
  .put(protect, authorize("user"), updateBookingByUser)
  .delete(protect, authorize("user"), deleteBookingByUser);
router
  .route("/:id")
  .get(protect, authorize("admin"), getBookingById)
  .put(protect, authorize("admin"), updateBookingByAdmin)
  .delete(protect, authorize("admin"), deleteBookingByAdmin);

module.exports = router;

//     GET www.project.com/booked/        |  use getBookingsByRole      |   user  -> owner book
//     GET www.project.com/booked/        |  use getBookingsByRole      |   admin -> all book / according to conditions {use Body}
//     GET www.project.com/booked/{id}    |  use getBookingById         |   admin -> id_book

//     PUT  www.project.com/booked/       |  use updateBookingByUser    |   user  -> owner book
//     PUT  www.project.com/booked/{id}   |  use updateBookingByAdmin   |   admin -> id_book

//     DELETE www.project.com/booked/     |  use deleteBookingByUser    |   user  -> owner book
//     DELETE www.project.com/booked/{id} |  use deleteBookingByAdmin   |   admin  -> id_book
