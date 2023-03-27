const jwt = require("jsonwebtoken")

const fs = require("fs")

const {createClient}=require("redis")
const client = createClient();

client.on("error",(err)=>{
    console.log(err)
})
client.connect()

let authentication = async(req,res,next)=>{
    let token = await client.get("token")

    try{
        if(token){
            let blacklisted = await client.lRange("blacklisted",0,-1)

            if(blacklisted.includes(token)){
                res.send("login /blacklisted")
            }
            else{
                let user = jwt.verify(token,"masai")
                if(user){
                    req.body.id=user.id
                    next()
                }
                else{
                    res.send("login first")
                }
            }
        }
        else{
            res.send("login first")
        }
    }
    catch(err){
        res.send(err)
    }
}

module.exports={
    authentication
}
