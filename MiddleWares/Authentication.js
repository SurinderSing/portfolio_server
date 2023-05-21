const User = require("../Models/userSchema");
const jswt = require("jsonwebtoken");

const Authentication = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const tokenVerify = jswt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User Not Found!");
    } else {
      req.rootUser = rootUser;
      req.token = token;
      req.userId = rootUser.id;
      next();
    }
  } catch (error) {
    res.status(401).json( "Unautherised!" );
  }
};

module.exports = Authentication;
