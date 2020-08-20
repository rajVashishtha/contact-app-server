const express = require('express')
const mysqlconnections = require('../../connection')

const Router = express.Router();


Router.get("/Contacts",(req,res)=>{
    res.send("hello")
})

module.exports = Router