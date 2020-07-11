const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    user: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    email: {type:String, required:true, unique:true, lowercase:true},
    name: {type:String,required:true},
    middlename: {type:String},
    lastname: {type:String, required:true},
    createDate: {type:Date, default:Date.now()},
    lastAccess: {type:Date, default:Date.now()}
})

mongoose.model("user", User)