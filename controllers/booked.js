const express = require("express");
const Booking = require("../schema/booked.js");

//     GET www.project.com/booked/ (don't use body)  |  use getBookingsByRole   |   user  -> owner book
//     GET www.project.com/booked/ (don't use body)  |  use getBookingsByRole   |   admin -> all book
//     GET www.project.com/booked/{id}               |  use getBookingById      |   admin -> id_book

exports.getBookingsByRole = async (req, res, next) => {
  let query;
  if (res.user.role === "user") {
    query = Booking.find({ email: req.user.email }).populate({
      path: "booked",
      select: "name , date , dentistName",
    });
  } else {
    // admin
    if (req.body.dentistName) {
      //find by Dentist Name
      query = Booking.find({ dentistName: req.body.dentistName });
    } else if (req.body.date) {
      // find by Date
      query = Booking.find({ date: req.body.date });
    } else {
      // see all
      query = Booking.find();
    }
  }
  try {
    let booked = await query;
    res.status(200).json({
      success: true,
      count: booked.length,
      data: booked,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    // already booking
    req.body.name = req.user.id;
    const existingBooking = await Booking.find({ name: req.user.id });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Booking already exists for this user",
      });
    }
    req.body.dentistName = req.dentist.id;
    const hasDentist = await Booking.find({ dentistName: req.dentist.id });
    if (hasDentist) {
      const booking = await Booking.create(req.body);
      res.status(201).json({ success: true, data: booking });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  POST www.project.com/booked/        |    User use
//  POST www.project.com/booked/{id}    |    Admin use
exports.updateBookingByUser = async (req, res, next) => {
  try {
    let booked = await Booking.findById(req.user.id);
    if (!booked) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.user.id}`,
      });
    }
    booked = await Booking.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booked,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update booking" });
  }
};

exports.updateBookingByAdmin = async (req, res, next) => {
  try {
    // bookedID
    let booked = await Booking.findById(req.params.id);
    if (!booked) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Appointment" });
  }
};

//     DELECT www.project.com/booked/ (don't use body)  |   user  -> delect owner book
//     DELECT www.project.com/booked/   (use body)      |   admin -> delect id_book
// delete /booked/{:id} | bookedID -> user -> userID !== user.userID -> user.role === admin -> delete
exports.deleteBookingByAdmin = async (req, res, next) => {
  try {
    const booked = await Appointment.findById(req.params.id);

    if (!booked) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }
    await booked.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Appointment",
    });
  }
};

exports.deleteBookingByUser = async (req, res, next) => {
  try {
    let booked = await Booking.findById(req.user.id);
    if (!booked) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.user.id}`,
      });
    }
    await booked.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Appointment",
    });
  }
};
