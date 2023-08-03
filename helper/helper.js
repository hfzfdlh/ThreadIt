const bcrypt = require('bcryptjs')

function checkPass(pass, dbPass){
    return bcrypt.compareSync(pass,dbPass)
}

module.exports = {checkPass}