const User = require("../schema/user.js");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[1];
  }
  if (!token) {
    res
      .status(401)
      .json({ screen: false, message: "Not authorize to access this route" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json({ screen: false, message: "Not authorize to access this route" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
