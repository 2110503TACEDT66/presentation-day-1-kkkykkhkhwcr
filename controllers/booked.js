const express = require("express");
const Booking = require("../schema/booked.js");
const Dentist = require("../schema/dentist.js");

//     GET www.project.com/booked/ (don't use body)  |  use getBookingsByRole   |   user  -> owner book
//     GET www.project.com/booked/ (don't use body)  |  use getBookingsByRole   |   admin -> all book
//     GET www.project.com/booked/{id}               |  use getBookingById      |   admin -> id_book

exports.getBookingsByRole = async (req, res, next) => {
  let query;
  if (req.user.role === "user") {
    query = Booking.find({ name: req.user._id }).populate({
      path: "name dentistName",
      select: "name",
    });
  } else {
    // admin
    if (req.body.dentistName) {
      //find by Dentist Name
      console.log("dentistname");
      query = Booking.find({ dentistName: req.body.dentistName }).populate({
        path: "name dentistName",
        select: "name",
      });
    } else if (req.body.date) {
      // find by Date
      console.log("book date");
      query = Booking.find({ date: req.body.date }).populate({
        path: "name dentistName",
        select: "name",
      });
    } else {
      // see all
      console.log("not found");
      query = Booking.find().populate({
        path: "name dentistName",
        select: "name",
      });
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
    if (existingBooking.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Booking already exists for this user",
      });
    }
    const hasDentist = await Dentist.findOne({ name: req.body.dentistName });
    if (!hasDentist) {
      return res
        .status(404)
        .json({ success: false, message: "Dentist not found" });
    }
    req.body.dentistName = hasDentist;
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//  PUT www.project.com/booked/        |    User use
//  PUT www.project.com/booked/{id}    |    Admin use
exports.updateBookingByUser = async (req, res, next) => {
  try {
    let booked = await Booking.findOne({ name: req.user.id });
    console.log(booked);
    if (!booked) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.user.id}`,
      });
    }
    const hasDentist = await Dentist.findOne({ name: req.body.dentistName });
    if (!hasDentist) {
      res.status(404).json({ success: false, message: "Dentist not found" });
    }
    req.body.dentistName = hasDentist;
    booked = await Booking.findByIdAndUpdate(booked, req.body, {
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
      .status(400)
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
    const hasDentist = await Dentist.findOne({ name: req.body.dentistName });
    if (!hasDentist) {
      return res
        .status(404)
        .json({ success: false, message: "Dentist not found" });
    }
    req.body.dentistName = hasDentist;
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Cannot update Appointment" });
  }
};

//     DELECT www.project.com/booked/ (don't use body)  |   user  -> delect owner book
//     DELECT www.project.com/booked/   (use body)      |   admin -> delect id_book
exports.deleteBookingByAdmin = async (req, res, next) => {
  try {
    const booked = await Booking.findById(req.params.id);

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
    return res.status(400).json({
      success: false,
      message: "Cannot delete Appointment",
    });
  }
};

exports.deleteBookingByUser = async (req, res, next) => {
  try {
    let booked = await Booking.findOne({ name: req.user.id });
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
    return res.status(400).json({
      success: false,
      message: "Cannot delete Appointment",
    });
  }
};