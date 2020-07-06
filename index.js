//Node_modules
const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')


//Configurações

//express
const app = express()


//Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    allowedProtoMethods:{
        trim:true,
    }
}))
app.set('view engine','handlebars')

app.use(express.static(path.join(__dirname,'/public/')))

//Mongoose
mongoose.connect("mongodb://localhost/nodetask",{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection;
db.on('err', console.error.bind(console,'Erro na conexão'));
db.once('open', ()=>{console.log('Banco conectado !')})




//Rotas
app.get("/", (req,res)=>{
    res.render('home')
})

app.get("/task", (req,res)=>{
    res.render('./tasks/task')
})



//Resto

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log("Node rodando na porta: "+port)
})