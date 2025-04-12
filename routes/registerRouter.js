const express = require("express");
const Register = express.Router();
const user = require("../controllers/registerController");

Register.post("/",user.register);
Register.post("/login",user.login);



module.exports = Register;
