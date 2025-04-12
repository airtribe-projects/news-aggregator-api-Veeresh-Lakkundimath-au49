require("dotenv").config();
const mongoose = require("mongoose");
module.exports.connect = async () => {
  try {
    
    await mongoose.connect("mongodb+srv://VeereshCluster:GvXGXZONU6U1R36O@veereshcluster.dpxprjq.mongodb.net/eventmanagement?retryWrites=true&w=majority&appName=VeereshCluster", {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("mongodb connected");
  } catch (error) {
    console.log("error: ", error);
  }
};
