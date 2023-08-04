const bcrypt = require('bcryptjs')
const path = require('path')
const multer = require('multer')

function checkPass(pass, dbPass){
    return bcrypt.compareSync(pass,dbPass)
}

function createPass(pass){
    let hashKey = Math.floor(Math.random() * 11);
    let salt = bcrypt.genSaltSync(hashKey)
    return bcrypt.hashSync(pass,salt)
}

let storageProfile =  multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/profileImageUrl"))
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname +"-" + Date.now() + path.extname(file.originalname))
    }
})

let storagePost =  multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/photoUrl"))
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname +"-" + Date.now() + path.extname(file.originalname))
    }
})

const uploadProfile = multer({storage:storageProfile}).single('profileImageUrl')
const uploadPost= multer({storage:storagePost}).single('photoUrl')

module.exports = {checkPass, createPass,uploadProfile,uploadPost}