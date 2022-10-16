/** @format */
const jwt = require("jsonwebtoken");
const User = require("../model/userScehma");

const Authenticate = async (req, resp, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SECERT_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    resp.status(401).send("Unauthorized:No token provided");
    console.log(error);
  }
};

module.exports = Authenticate;
