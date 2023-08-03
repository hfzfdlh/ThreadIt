const {User,UserProfile,Post,Comment,Reaction, Sequelize} = require('../models')
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

    static getEditProfile(req,res){
        const id = req.params.id
        const userName = User.passBreaker(id)
        // console.log(id,userName)

        User.findAll({include:UserProfile,
            where:{
                userName
            }})
            .then(data=>{
                res.render('edit-profile',{data});
            })
            .catch(err=>res.send(error))
        
    }

    static postEditProfile(req,res){
        const id = req.params.id
        const userName = User.passBreaker(id)
        const {name,dateOfBirth,profileImageUrl,shortProfile} = req.body
    

        let userData

        User.findAll({
            where:{
                userName
            }}) 
            .then(data=>{
                // console.log(data)
                userData = data
                return UserProfile.update({name,dateOfBirth,profileImageUrl,shortProfile},{
                    where:{
                        UserId:userData[0].id
                    }
                })
            })
            .then((updateData)=>{
                console.log(updateData)
                res.redirect(`/home/${userData[0].randomizeInput()}`)
            })
            .catch(err=>{
                console.log(err)
                res.send(err)})
        
    }

    static getThreadDetail(req,res){
        const {comment,reaction} = req.query
        // console.log('comment',comment)
        const id = req.params.id
        const postId = Post.passBreaker(id)
        // console.log(postId,id)
       
       
        function fillPage(postId){
            let userData
            let commentList
            let reactionList
            Post.findByPk(postId,{
                include:{
                    model:User,
                    include:{
                        model:UserProfile
                    }
                }}) 
                .then(data=>{
                    // console.log(data.User)
                    userData = data
                    return Post.findByPk(postId,{
                        include:{
                            model:Comment,
                            include:{
                                model:User,
                                include:{
                                    model:UserProfile
                                }
                            }
                        }})
                    
                })
                .then((comment)=>{
                    // console.log(comment)
                    commentList = comment
                    return Post.findByPk(postId,{
                        include:{
                            model:Reaction,
                        }})
                    
                }).then(reaction=>{
                    reactionList = reaction
                    return Reaction.findAll({
                        attributes:[
                            [Sequelize.fn('DISTINCT',Sequelize.col('reaction')),'reaction']
                        ]
                    })
                })
                .then(reactDistinct=>{
         
                    res.render('thread',{data:userData,comment:commentList,reaction:reactionList,reactDistinct})
    
                })
                .catch(err=>{
                    console.log(err)
                    res.send(err)})
        }

        if (comment){
            Post.findByPk(postId,{include:User})
            .then(data=>{
                Comment.create({comment, PostId:postId,UserId:data.User.id})
            }).then(data=>{
                console.log(data)
                fillPage(postId)
            })
        } else if(reaction){
            Post.findByPk(postId,{include:User})
            .then(data=>{
                Reaction.create({reaction, PostId:postId,UserId:data.User.id})
            }).then(data=>{
                console.log(data)
                fillPage(postId)
            })
        }
        else{
            fillPage(postId)
        }

       
        
    }
}

module.exports = Controller