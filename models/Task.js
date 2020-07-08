const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Task = new Schema({
    name: {type:String, required:true},
    createDate: {type:Date, default:Date.now()},
    endDate: {type:Date},
    description: {type:String},
    user: {type:Schema.Types.ObjectId, ref:"user", required:true},
    done: {type:Boolean, default:false}
})

mongoose.model("task",Task)