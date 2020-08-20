const express = require('express')
const mysqlconnections = require('../../connection')

const Router = express.Router();

Router.get("/",(req, res)=>{
    mysqlconnections.query("SELECT * from users", (err, rows, field)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log("Query error")
        }
    })
});

Router.get("/:id",(req, res)=>{
    mysqlconnections.query(`SELECT * from users WHERE user_id = ${req.params.id} `, (err, rows, field)=>{
        if(!err){
            if(rows.length !== 0){
                return res.send(rows)
            }
            res.send({message:"no data found"})
            
        }
        else{
            console.log("Query error")
        }
    })
});

Router.post("/login",(req,res)=>{
    const {email_phone, password} = req.body;
    if(email_phone){
        const to_check = email_phone;
        mysqlconnections.query(`SELECT * from users WHERE email = '${to_check}' or phone = '${to_check}' `,(err, rows,fields)=>{
            if(!err){
                if(rows.length !== 0){
                    const real_password = rows[0].password
                    if(password === real_password ){
                        return res.send({message:"success",user:rows})
                    }
                    else{
                        return res.send({message : "Incorrect email or password",user:null, incorrectPassword:true,noEmail:false})
                    }
                }else{
                    return res.send({message:"No such email or phone number",user:null, incorrectPassword:false,noEmail:true})
                }
            }
            res.send(["error in query"])
        })
    }
    else{
        return res.send(["Incorrect data"])
    }
})

Router.post("/signup",async (req,res)=>{
    const {name, email, phone, password} = req.body
    var checking_user_for_signup = []
    await mysqlconnections.query(`SELECT * from users WHERE email = '${email}' or phone = '${password}'`,
     (err, rows, fields)=>{
        checking_user_for_signup = rows
    })
    if(checking_user_for_signup.length !== 0){
        console.log("checkhere",checking_user_for_signup)
        response = {message:"User Already Exist",user:null,exist:true,added:false}
        return 
    }
    console.log(email,phone,name,password)
    await mysqlconnections.query(`INSERT into users (name, email, phone, password) VALUES ('${name}', '${email}','${phone}','${password}')`,(err,result)=>{
        if(err){
            response = {user:null,message:"Error in server",exist:false,added:false}
            return
        }
        user = {
            name:name,
            email:email,
            password:password,
            phone:phone,
            user_id:result.insertId
        }
        response = {user:user,message:"successfull"}
        return
    })
    return res.send(response)
})

module.exports = Router