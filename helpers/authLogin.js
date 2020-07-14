module.exports ={
    authLogin: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error_msg","Faça seu login para ter acesso a essa página !")
        res.redirect("/user/login")
    }
}