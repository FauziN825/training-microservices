const UserData = require("../models/userdata");
const bcrypt = require("bcryptjs");
const response = require("../startup/response");


const { clearKey } = require("../redis/redis");

const createUserData = async (req, res) => {
  let userdata = new UserData(req.body);
  try {
    bcrypt.hash(userdata.password, 10, async function (err, encryptedPassword) {
      if (err) {
        return response(res, 400, false, `${err}`);
      }
      userdata.password = encryptedPassword;
      await userdata
        .save()
        .then((userdata) => {
          clearKey(UserData.collection.collectionName);
          return response(res, 201, true, "User added successfully");
        })
        .catch((err) => {
          return response(res, 400, false, err);
        });
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    let updatedUserData = await update(req.params.id, req.body);
    clearKey(UserData.collection.collectionName);
    res.status(201).send({ message: "User Updated", user: updatedUserData });
  } catch (err) {
    return response(res, 400, false, err.message);
  }
};

async function update(id, body) {
  const users = await UserData.findById(id);

  if (body.emailAddress != null) {
    users.emailAddress = body.emailAddress;
  }
  if (body.userName != null) {
    users.userName = body.userName;
  }
  if (body.accountNumber != null) {
    users.accountNumber = body.accountNumber;
  }
  if (body.identityNumber != null) {
    users.identityNumber = body.identityNumber;
  }

  return users.save();
}

const getUserDataById = async (req, res) => {
  try {
    const userdata = await UserData.findById(req.params.id).cache();

    if (!userdata) {
      return res.status(400).send("NOT FOUND");
    }
    res.status(200).send({ message: "get by id", user: userdata });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getUserData = async (req, res) => {
  const { _id } = req.userData;
  try {
    const userdata = await UserData.findById(_id).cache();
    return response(res, 200, true, "Logged in User Details", userdata);
  } catch (err) {
    return response(res, 400, false, "User Not Found");
  }
};

const deleteUserDataById = async (req, res) => {
  try {
    const userdata = await UserData.findById(req.params.id);
    if (!userdata) {
      return res.status(400).send("User Data Not Found");
    } else {
      UserData.findByIdAndRemove(req.params.id).then((found) => {
        clearKey(UserData.collection.collectionName);
        res.status(200).send({ message: "Successfully Deleted", user: found });
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllUserData = async (req, res) => {
  try {
    const userdata = await UserData.find({}).cache();
    return response(res, 200, true, "GET ALL USER", userdata);
  } catch (err) {
    return response(res, 400, false, "User Not Found", err);
  }
};

const getUserDataByAccountNumber = async (req, res) => {
  try {
    const userdata = await UserData.find({
      accountNumber: req.params.accountnumber,
    }).cache();
    if (userdata.length == 0) {
      return res.status(400).send("User Not Found");
    }
    res.status(200).send({ message: "Get by Account Number", user: userdata });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getUserDataByIdentityNumber = async (req, res) => {
  try {
    const userdata = await UserData.find({
      identityNumber: req.params.identitynumber,
    }).cache();
    if (userdata.length == 0) {
      return res.status(400).send("User Not Found");
    }
    res.status(200).send({ message: "Get by Account Number", user: userdata });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  update,
  createUserData,
  updateUserData,
  getAllUserData,
  getUserDataById,
  deleteUserDataById,
  getUserData,
  getUserDataByAccountNumber,
  getUserDataByIdentityNumber,
};
