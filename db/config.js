const mongoose = require("mongoose")

async function connectDB() {
  try{
    await mongoose.connect("mongodb://localhost:27017/deviceTracker", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Connected");
  }catch(error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB