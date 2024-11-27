const express = require("express")
const DeviceDetector = require('node-device-detector');
const connectDB = require("./db/config")
const User = require("./model/user.model")

const app = express()
const detector = new DeviceDetector()

app.use(express.json())
connectDB()

app.use(async (req, res, next) => {
  const userName = req.header("username")

  if(!userName) {
    return res.json({
      message: "username is not defined"
    })
  }

  const userAgent = req.headers["user-agent"]
  const foundedDevice = detector.detect(userAgent)
  const deviceId = 
  `${foundedDevice?.device?.os?.name}-${foundedDevice?.device?.type}-${foundedDevice?.client?.name}`

  try {
    let foundedUser = await User.findOne({username: userName})
    if(!foundedUser) {
     foundedUser = new User({username: userName, devices: {deviceId, deviceName: foundedDevice?.device?.brand}})
    }else{
      const exisitsDevice = foundedUser.devices.find((item) => item.deviceId === deviceId)
      
      if(!exisitsDevice) {
        if(foundedUser.devices.length >= 3){
          return res.json({
            message: "Device limit exeeded! you cannot user more then 3 devices"
          })
        }
        foundedUser.devices.push({deviceId, deviceName: foundedDevice?.device?.brand})
      }
    }
    await foundedUser.save()
    next()
  }catch(error) {
    next(error.message)
  }
})

app.get("/", (req, res) => {
  res.json({message: "Welcome to my app"})
})

app.listen(3000, () => {
  console.log("3000");
})