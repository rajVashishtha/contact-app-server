const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysqlConnection = require('./connection')
const userRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')

const app = express()



app.use(bodyParser.json())
app.use(cors({
    origin:"*"
}));

app.use("/users", userRouter)
app.use("/contacts",contactsRouter)


mysqlConnection.connect((err)=>{
    if(!err){
        console.log("connected")
    }
    else{
        console.log("Error connecting")
    }
})
// app.get('/', (req, res)=>{
//     res.send("<h1>Hello World ! ! ! </h1>")
// })

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>console.log(`server running at ${PORT}`))