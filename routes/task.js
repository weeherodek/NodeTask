const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const app = express()

require("../models/User")
require("../models/Task")

const User = mongoose.model("user")
const Task = mongoose.model("task")

router.get("/", (req,res)=>{
    
    res.render("./task/task")

})

router.get("/add", (req,res)=>{
    res.render("./task/add")
})

router.post("/add/new",(req,res)=>{
     let error = []
    if(req.body.endDate < Date.now())
        error.push({text:"Data de finalização já passou, deseja adicionar mesmo assim ?"})
    if(req.body.endDate == Date.now())
        error.push({text:"Data de finalização marcada para hoje, tem certeza que conseguirá finalizar ?"})
    if(error.length > 0){
        res.redirect("/../task/task", {error:error})
    }else{
        const newTask = {
            name: req.body.name,
            endDate: req.body.endDate,
            description: req.body.description,
            done: req.body.done
        }
        new Task(newTask).save((err)=>{
            if(err){
                req.flash("error_msg","Houve um erro interno ao salvar sua task, tente novamente !")
                res.redirect("/../task/add")
            }
            else{
                req.flash("success_msg","Tarefa adicionada com sucesso !")
                res.render("/")
            }
        })
    }
})


module.exports = router;