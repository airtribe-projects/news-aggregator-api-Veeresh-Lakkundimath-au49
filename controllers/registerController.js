const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cuid = require("cuid");
require("dotenv").config();

const saltRounds = 3;
const User = require("../models/user");
// const myPlaintextPassword = "s0//P4$$w0rD";
// const someOtherPlaintextPassword = "not_bacon";
// const inputPassword = "s0//P4$$w0rD";
// let hash = "$2b$04$UNprVdjOGD0NBBUiR1LKk.PLKMOM0gARBQzBc6Rnt6LHTKjzo3mze";

// bcrypt.compare(inputPassword, hash, function (err, result) {
//   console.log("checkhash: ", hash);
//   console.log("result: ", result);
// });

module.exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    if (
      (!name && name == "") ||
      (!email && email == "") ||
      (!password && password == "") ||
      (!type && type == "")
    ) {
      throw createError(400, "Invalid input");
    }
    console.log("req.body: ",req.body);
    //check for the user email in the DB
    const user_info = {
      email: email,
      type: type,
      is_deleted: false,
    };
    let user = await User.findOne(user_info);
    //throw error if user already present
    if (user) {
      throw createError(404, "User already exists");
    }
    //hash password
     
    let hashed_password = await bcrypt.hash(req.body.password, saltRounds)
    // store the user obj in the DB
    const uid = cuid();
    console.log("out hashed_password: ", hashed_password);
    const user_data = {
      uid: uid,
      name: name,
      email: email,
      password: hashed_password,
      type: type,
    };
    console.log("user_data: ",user_data);
    user = await User.create(user_data);
    return res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};

module.exports.login = async (req, res) => {
  try {
    //find the email and from body
    const { email, password } = req.body;
    //check for the email in the DB
    const user_info = {
      email: email,
      is_deleted: false,
    };
    let user = await User.findOne(user_info);
    //compare the passwords
    
    let isRegistered = await bcrypt.compare(password, user.password)
    console.log("isRegistered: ", isRegistered);
    if (!isRegistered) {
      throw createError(404, "User not registered");
    }
    //response
    const payload = {
      uid: user.uid,
    };

    // Token expiration time
    const expiresIn = "1h"; // Token will expire in 1 hour

    // Sign the JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

    return res.status(200).send({ token: token });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
};
