const express = require("express")
const DeviceDetector = require('node-device-detector');
const connectDB = require("./db/config");
const User = require("./model/user.model")

const app = express()
connectDB()
app.use(express.json())

const detector = new DeviceDetector()

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
  `${foundedDevice?.device?.model}-${foundedDevice?.device?.brand}-${foundedDevice?.device?.type}-${foundedDevice?.client?.name}-${foundedDevice?.client?.short_name}-${foundedDevice?.os?.family}-${foundedDevice?.os?.name}`

  try{
    let foundedUser = await User.findOne({username: userName})

    if(!foundedUser) {
      foundedUser = new User({username: userName, devices: {deviceId, deviceName: foundedDevice?.device?.brand}})
    }else{
      const existsDevice = foundedUser.devices.find((item) => item.deviceId === deviceId)

      if(!existsDevice) {
        if(foundedUser.devices.length <= 2){
          foundedUser.devices.push({deviceId, deviceName: foundedDevice?.device?.brand})
        }else{
          res.json({
            message: "Device limit exeeded! you cannot use more then 3 devices"
          })
        }
      }
    }
    
    await foundedUser.save()
    next()
  }catch(error) {
    next(error.message)
  }
})

app.get("/", (req, res) => {
  res.json({
    message: "Welecome to my app"
  })
})

app.listen(3000, () => {
  console.log("3000");
})
