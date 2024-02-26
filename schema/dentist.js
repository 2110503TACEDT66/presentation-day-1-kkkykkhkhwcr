const mongoose = require("mongoose");

const dentistSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add dentist name"],
    match: /^a-zA-Z\s/,
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

module.exports = mongoose.model("dentist", dentistSchema);
