const bcrypt = require('bcryptjs')

function checkPass(pass, dbPass){
    return bcrypt.compareSync(pass,dbPass)
}

function createPass(pass){
    let hashKey = Math.floor(Math.random() * 11);
    let salt = bcrypt.genSaltSync(hashKey)
    return bcrypt.hashSync(pass,salt)
}



module.exports = {checkPass, createPass}