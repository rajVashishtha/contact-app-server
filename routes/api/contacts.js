const express = require('express')
const mysqlconnections = require('../../connection')

const Router = express.Router();

getHandleId = (text)=>{
    if(text === "google" || text === "Google"){
        return 1
    }
    else if(text === "Facebook" || text === "facebook"){
        return 2
    }
    else if(text === "Instagram" || text === "instagram"){
        return 3
    }
    else if(text === "LinkedIn" || text === "linkedin"){
        return 4
    }
    else if(text === "Twitter" || text === "twitter"){
        return 5
    }
    else{
        return 6
    }
}


Router.post("/add",async (req,res)=>{
    console.log(req.body)
    const {user_id, contact_name, description, selectedHandles} = req.body
    const result = await saveContact(user_id, contact_name, description)
    console.log("result ->", result)
    const contact_id = result.insertId
    var result_for_saveHandle = []
    for (const [key, value] of Object.entries(selectedHandles)) {
        const temp = await saveHandle(user_id, contact_id, getHandleId(key), value)
        console.log(temp)
        result_for_saveHandle.push(temp)
    }
    res.send({msg:"successfull", result_for_saveHandle})
})

Router.get("/all/:user_id",async (req,res)=>{
    const c_id = await getContactIds(req.params.user_id)
    let c_id_set = new Set()
    for(var i=0;i<c_id.length;i++){
        c_id_set.add(c_id[i].contact_id)
    }
    console.log(c_id_set)
        console.log("start")
        real_result = await realLoop(c_id_set)
        console.log("real result -> ",real_result)
        return res.send(real_result)
})
realLoop = async (c_id_set)=>{
    return new Promise(async resolve=>{
        var r_loop = []
        for(const v of c_id_set){
            temp_r = await forHandlesData(v)
            r_loop.push(temp_r)
        }
        resolve(r_loop)  
    })
}
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
forHandlesData = async (c_id)=>{
    return sleep(1000).then(async v=>{
        const basic_info = await getContactInfoFromContactId(c_id)
            const handles = await getHandlesFromContactId(c_id)
            const to_add = {
                contact_name : basic_info[0].contact_name,
                contact_id:basic_info[0].contact_desc,
                handles: handles
            }
            return to_add
    })
    
}

getContactInfoFromContactId =async (contact_id)=>{
    return new Promise((resolve,reject)=>{
        mysqlconnections.query(`SELECT contact_name, contact_desc from user_contacts where contact_id = ${contact_id}`,(err,rows)=>{
            if(!err){
                resolve(rows)
            }else{
                reject(err)
            }
        })
    })
}

getHandlesFromContactId =async (contact_id)=>{
    return new Promise((resolve,reject)=>{
        mysqlconnections.query(`SELECT handle_id, handle_name from handles where contact_id = ${contact_id}`,(err,rows)=>{
            if(!err){
                resolve(rows)
            }
            else{
                reject(err)
            }
        })
    })
}

getContactIds = async (user_id)=>{
    return new Promise((resolve,reject)=>{
        mysqlconnections.query(`SELECT contact_id from handles where user_id = ${user_id}`,(err, res)=>{
            if(!err){
                resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

saveHandle = async (user_id, contact_id, handle_id, handles)=>{
    return new Promise((resolve, reject)=>{
        var result_for_one_save = []
        try{
            for(var i = 0; i<handles.length;i++){
                mysqlconnections.query(`INSERT INTO handles(user_id, contact_id, handle_id, handle_name) values(${user_id}, ${contact_id}, ${handle_id},'${handles[i]}')`,(err,rows)=>{
                    if(!err){
                        result_for_one_save.push(rows)
                    }
                })
            }
        }catch{
            reject("error")
        }
        resolve(result_for_one_save)
    })
}

saveContact = async (user_id, contact_name, desc)=>{
    return new Promise((resolve, reject)=>{
        mysqlconnections.query(`INSERT INTO user_contacts(user_id, contact_name, contact_desc) values(${user_id}, '${contact_name}','${desc}')`,(err,rows)=>{
            if(err){
                reject("Error")
            }
            else{
                resolve(rows)
            }
        })
    })

}

module.exports = Router