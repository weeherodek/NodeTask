const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { ifError } = require('assert')
const { authLogin } = require('../helpers/authLogin')
const router = express.Router()

require('../models/User')

const User = mongoose.model('user')

router.get("/", authLogin, (req,res)=>{
    User.findOne({_id:req.user._id}).lean().then((user)=>{
        res.render("user/user", {userlogin:user})
    })
})

router.post("/edit/:id", (req,res)=>{
    
    let erro = []

    if(req.body.password !== req.body.password2)
        erro.push({text:"Confirme sua senha !"})

    editUser = {
        name : req.body.name,
        middlename : req.body.middlename,
        lastname : req.body.lastname,
        password : req.body.password
    }
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.password,salt,(err,hash)=>{

            if(err){
                console.log("Houve um erro interno ao cadastrar seu usuário, tenta novamente\n" + err)
            }
            editUser.password = hash
        })
    })

    if(erro.length > 0){
            res.render("user/user" , {erro:erro})
    }
    else{
        User.findByIdAndUpdate({_id:req.user._id}, editUser).lean().then((user)=>{
            req.flash("success_msg","Usuário editado com sucesso !")
            res.redirect("/user")
        })
    }

    
})

router.get("/register", (req,res)=>{
    res.render("user/register")
})


router.post('/register/new', (req,res)=>{
    
    
    var error_register = [];


    if(req.body.email != req.body.email2)
        error_register.push({text:"Confirme seu email !"})

    if(req.body.password != req.body.password2)
        error_register.push({text:"Confirme sua senha !"})

    if(req.body.user == undefined || req.body.user.length <= 4)
        error_register.push({text:"Usuário pequeno, tente outro maior !"})

    if(req.body.name == undefined || req.body.name == "")
        error_register.push({text:"Confirme seu nome"})
    
    if(req.body.lastname == undefined || req.body.lastname == "")
        error_register.push({text:"Confirme seu último nome"})
    
    if(User.findOne( {email: req.body.email}) !== null)
        error_register.push({text:"Email já está sendo utilizado."})

    if(User.findOne({user:req.body.user}) !== null)
        error_register.push({text:"Usuário já está sendo utilizado."})
        
    if(error_register.length > 0)
        res.render("user/register", {error_register:error_register})


    else{
        const newUser ={
            user: req.body.user,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            middlename: req.body.middlename,
            lastname: req.body.lastname
        }
    
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(req.body.password,salt,(err,hash)=>{
    
                if(err){
                    console.log("Houve um erro interno ao cadastrar seu usuário, tenta novamente !")
                }
    
                newUser.password = hash
    
               new User(newUser).save((err)=>{
                if(err){
                    req.flash("error_msg", "Houve um erro " + err + " ao tentar salvar o usuário.")
                }
                else{
                    req.flash("success_msg","Usuário cadastrado com sucesso !")
                    res.redirect("/")
                }
            
                })
            })
        })
    }
    
})
    
   

router.get('/all', authLogin, (req,res)=>{
    User.find().lean().then((user)=>{
        res.render('user/all', {user:user})
    })
    
})


router.get('/login', (req,res)=>{
    res.render('user/login')
})

router.post('/login', (req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"/user/login",
        failureFlash: true
    })
    (req,res,next)
})

router.get('/logout', (req,res,next)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router;