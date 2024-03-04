const mongoose = require("mongoose");

const dentistSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add dentist name"],
    match: /^[a-zA-Z\s]+$/,
    unique: true,
  },
  experience: {
    type: Number,
    required: [true, "Please add years of experience"],
    min: [0, "Years of experience must be an integer"],
    validate: {
      validator: Number.isInteger,
      message: "Years of experience must be an integer",
    },
  },
  expertise: {
    type: [String],
    required: [true, "Please add your expertise"],
    validate: {
      validator: function (arr) {
        return arr.every((item) => /^[a-zA-Z]+$/.test(item));
      },
      message: "Subject of expertise must be string of alphabet",
    },
  },
});

dentistSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Booking removed from dentist ${this._id}`);
    await this.model("booked").deleteMany();
    next();
  }
);

module.exports = mongoose.model("dentist", dentistSchema);
