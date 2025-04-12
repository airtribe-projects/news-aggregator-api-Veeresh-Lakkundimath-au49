const mongoose = require("mongoose");
const express = require("express");
const app = express();

console.log("MONGODB_URI: ",process.env.MONGODB_URI)

const Register = require("./routes/registerRouter");
const Event = require("./routes/eventsRouter")
const PORT = 8000;


app.use(express.json());

app.use("/register",Register);

app.use("/login",Register);

app.use("/events",Event);
// app.use("/events",Event);
// app.use("/events",Event);
// app.use("/events",Event);


app.get("/",(req,res)=>{
    return res.status(200).send({message:"success"})
});


app.listen(PORT,()=>{
    require("./models/database").connect();
    console.log("server started successfully");
});