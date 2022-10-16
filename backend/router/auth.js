/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

const cookieParser = require("cookie-parser");
router.use(cookieParser());

const cors = require("cors");
router.use(cors());

require("../db/com");

const User = require("../model/userScehma");

router.get("/", (req, resp) => {
  resp.send("Helllo Home World from the Server router js");
});

// Using Promises

// router.post("/register", (req, resp) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return resp.status(422).json({ message: "Please fill details" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return resp.status(422).json({ error: "Email already exists" });
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });
//       user
//         .save()
//         .then(() => {
//           resp.status(201).json({ message: "User registration successfully" });
//           // resp.send(req.body);
//         })
//         .catch((err) => resp.status(500).json({ error: "Failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Using Async/Await

router.post("/register", async (req, resp) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return resp.status(422).json({ error: "Please fill Details" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return resp.status(422).json({ error: "Email Already Registered" });
    } else if (password != cpassword) {
      resp.status(201).json({ message: "Password Not matched" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();

      resp.status(201).json({ message: "User Registed Successfully" });
    }
  } catch (error) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ error: "Please Fill data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatched = await bcrypt.compare(password, userLogin.password);

      let token = await userLogin.generateAuthToken();

      resp.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 15892000000),
        httpOnly: true,
      });

      if (!isMatched) {
        resp.status(400).json({ error: "Invalid Credientials pass" });
      } else {
        resp.json({ message: "User Signin Successfully" });
      }
    } else {
      resp.status(400).json({ error: "Invalid Credientials" });
    }
  } catch (error) {
    console.log(error);
  }
});

// About us Page

router.get("/about", authenticate, (req, resp) => {
  console.log(`Hello my About`);
  resp.send(req.rootUser);
});

// Get data from

router.get("/getdata", authenticate, (req, resp) => {
  console.log(`Hello Contact`);
  resp.send(req.rootUser);
});

// Contact us Page

router.post("/contact", authenticate, async (req, resp) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      console.log("Error in contact form");
      return resp.json({ error: "plz filled the contact form" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();
      resp.status(201).json({ message: "User Contact Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Logout Page

router.get("/logout", (req, resp) => {
  console.log(`Hello my Logout page`);
  resp.clearCookie("jwtoken", { path: "/" });
  resp.status(200).send('User logout')
});

module.exports = router;
