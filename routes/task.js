const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const app = express()

router.get("/", (req,res)=>{
    res.render("./task/task")
})


module.exports = router;