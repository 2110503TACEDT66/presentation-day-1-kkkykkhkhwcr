const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dentistName: {
    type: mongoose.Schema.ObjectId,
    ref: "dentist",
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("booked", bookingSchema);
