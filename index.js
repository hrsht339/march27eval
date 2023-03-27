const express = require("express")
const winston = require("winston")
const exWinston = require("express-winston")
const {connection} = require("./configs/db")
const {userRouter} = require("./routes/user.route")
const {tempRouter} = require("./routes/temp.route")
const {authentication} = require("./middlewares/authentication.middleware")
const app =  express()
app.use(express.json())


app.use(exWinston.logger({
    statusLevels:true,
    transports:[
        new winston.transports.File({
            level:"silly",
            json: true,
            filename:"logger.log"
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))

app.use("/",userRouter)
app.use(authentication)
app.use("/",tempRouter)

app.listen(4300,async()=>{
    try{
        await connection
        console.log("db connected")
    }
    catch(err){
        console.log(err)
    }
    console.log("server connected")
})
