const express = require('express')
const mongoose = require('mongoose')
const {authLogin} = require('../helpers/authLogin')

const router = express.Router()
const app = express()

require("../models/User")
require("../models/Task")

const User = mongoose.model("user")
const Task = mongoose.model("task")

router.get("/", authLogin,(req,res)=>{
Task.find({user:req.user}).lean().then((task)=>{
Task.find({user:req.user,done:false}).lean().then((taskundone) =>{
Task.find({user:req.user,done:true}).lean().then((taskdone)=>{
    res.render("./task/task",{task:task,taskundone:taskundone,taskdone:taskdone})
})    
})
})
})

router.get("/add", authLogin,(req,res)=>{
    res.render("./task/add", {minDate:Date.now()})
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
            done: req.body.done,
            user: req.user,
        }
        new Task(newTask).save((err)=>{
            if(err){
                req.flash("error_msg","Houve um erro interno ao salvar sua task, tente novamente !" + err)
                res.redirect("/../task/add")
            }
            else{
                req.flash("success_msg","Tarefa adicionada com sucesso !")
                res.redirect("/")
            }
        })
    }
})

router.get('/edit/:id',authLogin,(req,res)=>{
    Task.find({_id:req.params.id}).lean().then((task)=>{
        
    User.find({_id:req.user}).lean().then((username)=>{
        res.render('task/edit',{username:username,task:task , minDate:Date.now(), done: task.filter((done)=>{return done.done===task.done})})
    })
    }).catch((err)=>{
        req.flash("error_msg","Página não encontrada")
        res.redirect('/')
    })
})

router.post('/edit/:id', (req,res)=>{
    editTask = {
        name: req.body.name,
        description: req.body.description,
        endDate: req.body.endDate,
        done: req.body.done
    }
    Task.findByIdAndUpdate({_id:req.params.id},editTask,(err,result)=>{
        if(err){
            req.flash("error_msg","Houve um erro ao editar sua task, tente novamente !")
            res.redirect("/task")
    }
        else{
            console.log(result)
            req.flash("success_msg","Task editada com sucesso !")
            res.redirect("/task")
        }
    })
})

router.get('/delete/:id',authLogin,(req,res)=>{
    Task.findOneAndDelete({_id:req.params.id}).then((err)=>{
        req.flash('success_msg',"Task deletada com sucesso !")
        res.redirect('/task')
    })
})


module.exports = router;