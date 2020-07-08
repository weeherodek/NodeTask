const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { use } = require('passport')


//Model de usuário

require('../models/User')

const User = mongoose.model("user")

module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'user'},(user,password,done)=>{
        User.findOne({user:user}).then((user)=>{
            if(!user){
                return done(null,false,{message:"Usuário não encontrado !"})
            }else{
                bcrypt.compare(password,user.password,(err,success)=>{
                    if(success){
                        User.findOne({user:user.user}).then((user)=>{
                            user.lastAccess = Date.now()
                            user.save()  
                        })
                        return done(null,user)
                    }else{
                        return done(null,false,{message:"Senha incorreta !"})
                    }
                })        
            }
        })
    }))


    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser((user,done)=>{
        User.findById(user._id,(err,user)=>{
            done(err,user)
        })
    })
}

