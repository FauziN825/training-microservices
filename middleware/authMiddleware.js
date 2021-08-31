const jwt = require("jsonwebtoken");
const { APP_KEY } = process.env;
const response = require("../startup/response");
const { check, validationResult } = require("express-validator");

exports.authCheck = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.substr(7);
    const data = jwt.verify(token, APP_KEY);
    if (data) {
      req.userData = data;
      return next();
    }
  }
  return res.status(401).json({
    success: false,
    message: "You need Authorization",
  });
};

exports.isFieldsEmpty = [
  check("password", "Password can't be empty").notEmpty(),
  check("userName", "Username can't be empty").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response(res, 400, false, errors.array()[0].msg);
    }

    return next();
  },
];

exports.isFieldsLength = [
  check("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response(res, 400, false, errors.array()[0].msg);
    }

    return next();
  },
];

exports.isFieldsLegalChars = [
  check("emailAddress", "Please enter valid email address").matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response(res, 400, false, errors.array()[0].msg);
    }

    return next();
  },
];
