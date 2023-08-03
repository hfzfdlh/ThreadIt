const {User,UserProfile,Post,Comment,Reaction} = require('../models')
const {checkPass} = require('../helper/helper')

class Controller{
    static getLogin(req,res){
        let loginFailed
        res.render('login',{loginFailed})
    }

    static postLogin(req,res){
        const {email, password} = req.body
        console.log('email',email)
        let loginFailed
        User.findAll({where:{
            email
        }})
        .then(data=>{
   
            let stat = false;
            if(data.length>0){
                if (checkPass(password,data[0].hashPassword)){
                    stat = true
                }
                if (stat){
                     res.redirect('home')
                } else{
                    loginFailed = 'Wrong Password'
                    res.render('login',{loginFailed})}
            }
            else{
                loginFailed = 'Wrong Username'
                res.render('login',{loginFailed})
            }
        })
        .catch(err=>{
            res.send(err)
        })
    }
}

module.exports = Controller