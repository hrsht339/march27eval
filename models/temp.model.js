const mongoose = require("mongoose")

const tempSchema = mongoose.Schema({
    name: String,
    temp: Number
})

const tempModel = mongoose.model("temp", tempSchema)

module.exports = { 
    tempModel
 }