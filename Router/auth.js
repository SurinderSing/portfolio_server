// const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
require("../DB/conn");
const bcrypt = require("bcryptjs");
const authentication = require("../MiddleWares/Authentication");
const User = require("../Models/userSchema");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
//Declairing middlewares ::

// router.get("/register", (req, res) => {
//   res.send(req.body);
// });

// use register using Async And Await::

router.post("/register", async (req, res) => {
  // object destructuring ::
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "fields cann't be empty!" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "User Already Exist!" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password doesn't match!" });
    } else {
      const newUser = new User({
        name: name,
        email: email,
        phone: phone,
        work: work,
        password: password,
        cpassword: cpassword,
      });
      await newUser.save();
      return res.status(201).json({ message: "user registered successfully!" });
    }
  } catch (error) {
    return console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill the data!" });
    }
    //finding the User Using async and await::
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(400).json({ message: "please register first!" });
    } else {
      const newPassword = await bcrypt.compare(password, userFound.password);
      if (!newPassword) {
        return res.status(400).json({ message: "invalid credentials!" });
      } else {
        // here we are Creating JWS token::
        const token = await userFound.generateAuthToken();
        // add JWS token to the Cookies::
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 1200000),
          httpOnly: true,
        });
        return res
          .status(200)
          .json({ message: "Welcom-Back! Now you are loggedIn!" });
      }
    }
  } catch (err) {
    return console.log(err);
  }
});

router.get("/about", authentication, (req, res) => {
  // res.status(200).json({ message: "Hello About!!" });
  return res.status(200).send(req.rootUser);
  // res.send(req.rootUser);
});

router.get("/getdata", authentication, (req, res) => {
  return res.status(200).send(req.rootUser);
});

router.post("/contact",authentication, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Please fill the data" });
    }
    const userExist = await User.findOne({ _id: req.userId });
    if (!userExist) {
      return res.status(404).json({ message: "You are not allowed to send message please register first" });
    }
    await userExist.addMessage(name, email, phone, message);
    return res.status(200).json({ message: 'message send successfully'});
  } catch (error) {
    res.json({ error });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).send("User Logout!");
});
 

module.exports = router;
