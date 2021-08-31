const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("../startup/response");
const UserData = require("../models/userdata");
const userDataControl = require("../controllers/userDataController");
const environement = require('../environement');


const register = (req, res) => {
  const { userName, emailAddres, accountNumber, identityNumber } = req.body;
  UserData.countDocuments(
    {
      userName: userName,
      emailAddres: emailAddres,
      accountNumber: accountNumber,
      identityNumber: identityNumber,
    },
    function (err, count) {
      if (count > 0) {
        return response(res, 400, false, "User Data is Already Registered");
      } else {
        UserData.countDocuments({ userName: userName }, function (err, count) {
          if (count > 0) {
            return response(
              res,
              400,
              false,
              "Username already used, please input another username"
            );
          }
          let userdata = new UserData(req.body);
          bcrypt.hash(userdata.password, 10, function (err, encryptedPassword) {
            if (err) {
              return response(res, 400, false, `${err}`);
            }
            userdata.password = encryptedPassword;
            // userDataControl
            userdata
            .save()
              .then((userdata) => {
                return response(res, 200, true, "User added successfully");
              })
              .catch((err) => {
                return response(res, 400, false, err);
              });
          });
        });
      }
    }
  );
};

const login = (req, res) => {
  const { userName, password } = req.body;
  UserData.findOne({
    $or: [
      {
        userName: userName,
      },
    ],
  }).then((userdata) => {
    if (userdata) {
      bcrypt.compare(password, userdata.password, function (err, result) {
        if (err) {
          return response(res, 400, false, `${err}`);
        }
        if (result) {
          let token = jwt.sign(
            {
              userName: userdata.userName,
              _id: userdata._id,
              accountNumber: userdata.accountNumber,
            },
            environement.appkey,
            {
              expiresIn: "10h",
            }
          );
          return response(res, 200, true, "Login Successfully", token);
        } else {
          return response(res, 400, false, "Wrong Password");
        }
      });
    } else {
      return response(res, 400, false, "User Not found");
    }
  });
};

module.exports = {
  register,
  login,
};
