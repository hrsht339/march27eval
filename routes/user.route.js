const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const {userModel} = require("../models/user.model")
const userRouter = express.Router()
const {createClient} = require("redis")
const client = createClient()
client.on("error",(err)=>{
    console.log("redis makin error",err)
})
client.connect();

userRouter.post("/signup",async(req,res)=>{
    let {name,email,pass,city} = req.body
    try{
        bcrypt.hash(pass,2,async(err,hashed)=>{
            let user = new userModel({name,email,pass:hashed,city})
            await user.save()
            res.send({
                "msg":"sigup success",
                user
            })
        })
    }
catch(err){
    console.log(err)
    res.send(err)
}
})

userRouter.post("/login",async(req,res)=>{
    let {email,pass} = req.body
    try{
        let user = await userModel.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,async(err,result)=>{
                if(result){
                    let token = jwt.sign({"id":user._id},"masai")
                    await client.set("token",token)
                    res.send({
                        "msg":"login success"
                    })
                }
                else{
                    res.send({
                        "msg":"wrong pass"
                    })
                }
            })
        }
        else{
            res.send({
                "msg":"wrong email"
            })
        }
    }
    catch(err){
        res.send({
            "msg":"error in logging in",
            err
        })
    }
})

userRouter.get("/logout",async(req,res)=>{
    let token = await client.get("token")

    try{
        if(token){
            await client.lPush("blacklisted",token)
            res.send({
                "msg":"logout success"
            })
        }
        else{
            res.send({
                "msg":"login first"
            })
        }
    }
    catch(err){
        res.send({
            "msg":"login out error",
            err
        })
    }
})

module.exports={
    userRouter
}