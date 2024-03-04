const Dentist = require("../schema/dentist.js");
const pagination = require("pagination");

exports.getDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: dentist,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Cannot find Dentist",
    });
  }
};

exports.getDentists = async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Dentist.find(JSON.parse(queryStr));
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }
  //query = Dentist.find();
  try {
    let dentists = await query;
    res.status(200).json({
      success: true,
      count: dentists.length,
      data: dentists,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

exports.createDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.create(req.body);
    res.status(201).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with the id of ${req.params.id}`,
      });
    }
    await dentist.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Cannot delete Dentist",
    });
  }
};

exports.updateDentist = async (req, res, next) => {
  try {
    let dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with the id of ${req.params.id}`,
      });
    }
    const updateDentist = await Dentist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updateDentist,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: "Cannot update Dentist" });
  }
};