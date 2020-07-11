module.exports = {
    authAdmin: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","Esse página é apenas para administradores !")
        res.redirect("/")
    }
}