const {User,UserProfile,Post,Comment,Reaction} = require('../models')
const {checkPass} = require('../helper/helper')

class Controller{
    static getLogin(req,res){
        let loginFailed
        res.render('login',{loginFailed})
    }

    static mainPage(req,res){
        // res.render('home')
        // console.log('req.params',req.params)
        const id = req.params.id

        const userName = User.passBreaker(id)
        // console.log(userName)
        
        let userData

        User.findAll({include:UserProfile,
        where:{
            userName
        }})
        .then(data=>{
            userData = data
            return Post.findAll({
                include:[
                    {model:User,
                    include:{model:UserProfile}}
                
            ],
            order:[["createdAt","DESC"]]
            })
        })
        .then(post=>{
            // console.log(post[0].User.UserProfile)
            res.render('home',{data:userData,post})
        })
        .catch(err=>{
            res.send(err)
        })

    }

    static postLogin(req,res){
        const {email, password} = req.body

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
                    console.log('stat',stat)
                     res.redirect(`/home/${data[0].randomizeInput()}`)
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

    static getRegister(req,res){
        const errorPass = req.query
        res.render('register',{errorPass})
    }

    static postRegister(req,res){
        let {name,dateOfBirth,profileImageUrl,shortProfile,email,userName,password,confirmPass} = req.body
        console.log(req.body)
        let err 
        if (password !== confirmPass){
            err = ['Password tidak sama, ulangi kembali']
            res.redirect(`/register?errorPass=${err}`)
        } else{
            let saveUser
            User.create({userName,hashPassword:password,email})
            .then(data=>{
                saveUser = data
                return UserProfile.create({name,dateOfBirth,profileImageUrl,shortProfile,UserId:data.id})
            })
            .then(()=>{
                res.redirect('login')
            })
            .catch(err=>{
                res.send(err)
            })
        }

  
     
    }
}

module.exports = Controller