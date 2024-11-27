const mongoose = require("mongoose")

const User = new mongoose.Schema({
  username: String,
  devices: [
   { 
    deviceId: String,
    deviceName: String
  }
  ]
})

module.exports = mongoose.model("User", User)