const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const environement = require("./environement");
const winston = require("winston");

const auth = require("./routes/authRoute");
const user = require("./routes/userDataRoute");
let redis = require("redis");

const responseTime = require("response-time");

let client = redis.createClient();

mongoose.Promise = global.Promise;

let dbURI;
if (process.env.NODE_ENV === "development") {
  dbURI = environement.dburl;
}
if (process.env.NODE_ENV === "test") {
  dbURI = environement.dburltest;
}
mongoose
  .connect('mongodb://db')
  .then(() => winston.info("Mongo Db Connected....."));
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", (err) => {
  console.log("DB Estabilished");
});

// instantiate a connection to redis
client.on("connect", () => {
  console.log("Connected to Redis...");
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
  console.log(replies.length + " replies:");
  replies.forEach(function (reply, i) {
    console.log("    " + i + ": " + reply);
  });
  client.quit();
});
const { APP_PORT } = process.env;
const app = express();
const cors = require("cors");
app.use(cors());

//logging api
app.all("*", function (req, res, next) {
  console.log("API HIT");
  console.log("Time: ", new Date(Date.now()).toDateString());
  console.log("Request URL : " + req.originalUrl);
  console.log("Request Method : " + req.method);
  next();
});

app.use(responseTime());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", [auth, user]);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Backend is running well",
  });
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
