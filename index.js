//Node_modules
const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const moment = require('moment')



//Configurações


//Express

const app = express()


//Passport

require('./config/auth')(passport)


app.use(session({
    secret:"nodetask",
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//Middleware
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user
    next()
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const { urlencoded } = require('body-parser')
const { allowedNodeEnvironmentFlags } = require('process')

//Handlebars

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers:{
        dateFormat:(date)=>{
            return moment(date).format("DD/MM/YYYY")
        },
        hourFormat:(date)=>{
            return moment(date).format("HH:MM")
        },
        date_Format:(date)=>{
            return moment(date).format("YYYY-MM-DD")
        },
    },
    allowedProtoMethods:{
        trim:true,
    }
}))

app.set('view engine','handlebars')

app.use(express.static(path.join(__dirname,'public')))



//Mongoose

mongoose.connect("mongodb://localhost/nodetask", {useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection;
db.on('err', console.error.bind(console,'Erro na conexão'));
db.once('open', ()=>{console.log('Banco conectado !')})

//Rotas

const task = require('./routes/task')
app.use("/task",task)

const user = require('./routes/user')
app.use("/user",user)

const about = require('./routes/about')
const { format } = require('path')
app.use("/about",about)

app.get("/", (req,res)=>{
    res.render('home')
})

//Resto

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log("Node rodando na porta: "+ port)
})