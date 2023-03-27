const express = require("express")

const { tempModel} = require("../models/temp.model")

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));



const tempRouter = express.Router()



const { createClient } = require("redis")

const client = createClient();

client.on('error', (err)=>{
    console.log(err)
});


client.connect();


tempRouter.post("/temp/:city", async(req, resp) => {
    const  city  = req.params.city;
    const cdata = await client.hGet("weatherhm", `${city}`)

    if (cdata) {

        resp.send(JSON.stringify(cdata))

    }
    
    else {


            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=a0cb6ef5804bcaa428c213a4832f4589`

            fetch(url).then((result) => {

                return result.json()

            })
            .then(async (res) => {
                let data = await res.main
                
                let name = await res.name
                let tempDATA = {
                    "name": name,
                    "temp": data.temp
                }

                await client.hSet("weatherhm",`${JSON.stringify(city)}`,`${JSON.stringify(tempDATA)}`)

                resp.send({

                    tempDATA
                })

            })

    }
})




module.exports = {
     tempRouter
     }