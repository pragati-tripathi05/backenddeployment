const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("./config/db");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

const UserModel = require("./models/user.models");
const todoRouter = require("./routes/todo.routes");

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  await bcrypt.hash(password, 5, function (err, hash) {
    if (err) {
      res.send("Error");
    }
    const user = new UserModel({ email, password: hash });
    user.save();
    return res.send("Signup successfull");
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.send("Please write correct details");
  }
  const hashed_password = user.password;
  await bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      return res.send("error");
    }
    if (result == true) {
      const token = jwt.sign(
        {
          email: user.email,
          _id: user._id,
        },
        process.env.JWT_SECRET
      );
      return res.send({
        message: "Login success",
        token: token,
        userId: user._id,
      });
    } else {
      res.send("Enter correct details");
    }
  });
});

const authentication = (req, res, next) => {
  if (!req.header.authorization) {
    return res.send("Not authenticated");
  } else {
    const userToken = req.headers.authorization.split(" ")[1];
    jwt.verify(userToken, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.send("error");
      } else {
        next();
      }
    });
  }
};

//app.use(authentication);
app.use("/todo", todoRouter);

app.listen(PORT, async (req, res) => {
  try {
    await connection;
    console.log(`Connected to db successfully on port ${PORT}`);
  } catch (err) {
    console.log("Error connecting to db: ", err);
  }
});
