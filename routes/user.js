const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const bcrypt = require('bcrypt')

const router = express.Router()

require('../models/User')

const User = mongoose.model('user')

router.get("/", (req,res)=>{
    res.render("user/user")
})

router.get("/register", (req,res)=>{
    res.render("user/register")
})


router.post('/register/new', (req,res)=>{
    
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
                console.log("Erro ao inserir novo usuário:" + err)
            }
            else{
                console.log("Usuário cadastrado com sucesso !")
                res.redirect("/")
            }

            })
        })
    })
})
    
    
    

    

router.get('/all', (req,res)=>{
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
        failureRedirect:"/task/"
    })(req,res,next)
})

module.exports = router;