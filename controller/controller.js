const {User,UserProfile,Post,Comment,Reaction, Sequelize} = require('../models')
const {checkPass} = require('../helper/helper')
const { Op } = require("sequelize");
// const { uploadProfile } = require('../helper/helper');

let session
class Controller{
    static getLogin(req,res){
        let loginFailed
        session = req.session

        res.render('login',{loginFailed})
    }

    static mainPage(req,res){
        // res.render('home')
        // console.log('req.params',req.params)
        const{search,sort,errorPass} = req.query
        const id = req.params.id
        // console.log('search',search)
        const userName = User.passBreaker(id)
        // console.log(userName)

        let options = {
            include:[
                {model:User,
                include:{model:UserProfile}}
            
        ]
        
        }
        
        if(search){
            options.where={
                title:{
                [Op.iLike]:`%${search}%`
                }
            }
        }
        if(sort){
            options.order=[["createdAt",sort]]
        }
        let userData

        User.findAll({include:UserProfile,
        where:{
            userName
        }})
        .then(data=>{
            userData = data
            return Post.findAll(options)
        })
        .then(post=>{
            // console.log('post',post)
            res.render('home',{data:userData,post,errorPass})
        })
        .catch(err=>{
            if(err.name="SequelizeValidationError"){
                errorPass = err.errors.map(el=>el.message)
                res.render('home',{data:userData,post,errorPass})
            }else{
                res.send(error)
            }
        })

    }

    static mainAddPage(req,res){
        // res.render('home')
        // console.log('req.params',req.params)
        const{title,content} = req.query
        const id = req.params.id
        const userName = User.passBreaker(id)

        let options = {
            include:[
                {model:User,
                include:{model:UserProfile}},
             ],
             order:[["createdAt","DESC"]]
        
        }
        
        let userData
        


        User.findAll({include:UserProfile,
        where:{
            userName
        }})
        .then(data=>{
            // console.log('data',data)
            userData = data
            return Post.create({title,content,UserId:data[0].id})
        })
        .then(post=>{
            return Post.findAll(options)

        }).then(post=>{
            // console.log(post)
            res.redirect(`/home/${id}`)
        })
        .catch(err=>{
            if(err.name="SequelizeValidationError"){
                let errorPass = err.errors.map(el=>el.message)
                res.redirect(`/home/${id}?errorPass=${errorPass}`)
            }else{
                res.send(error)
            }
        })

    }

    static deleteThread(req,res){
        // res.render('home')
        // console.log('req.params',req.params)
        const {userId,postId} = req.params
        
        let idPost = Post.passBreaker(postId)
        const userName = User.passBreaker(userId)
        // console.log(postId,userName)

        // let options = {
        //     include:[
        //         {model:User,
        //         include:{model:UserProfile}},
        //      ],
        //      order:[["createdAt","DESC"]]
        
        // }
        
        // let userData


        Post.destroy({where:{
                id:idPost
            }})
        .then(post=>{
            // console.log(post)
            res.redirect(`/home/${userId}`)
        })
        .catch(err=>{
            res.send(err)
        })

    }

    static postLogin(req,res){
        const {email, password} = req.body

        let loginFailed

        session=req.session;
        session.userid=req.body.email;

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
                    // console.log('stat',stat)
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
            if(err.name="SequelizeValidationError"){
                loginFailed = err.errors.map(el=>el.message)
                res.render('login',{loginFailed})
            }else{
                res.send(error)
            }
            
        })
    }

    static getRegister(req,res){
        const errorPass = req.query
        res.render('register',{errorPass})
    }


    static postRegister(req,res){
        let {name,dateOfBirth,shortProfile,email,userName,password,confirmPass} = req.body
        let profileImageUrl = 'profileImageUrl/'+req.file.filename


       
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
            .catch(error=>{
                if(error.name="SequelizeValidationError"){
                    let errorArr = error.errors.map(el=>el.message)
                    res.redirect(`/register?errorPass=${errorArr}`)
                }else if(error.name="SequelizeUniqueConstraintError"){
                    let errorArr = error.errors.map(el=>el.message)
                    res.redirect(`/register?errorPass=${errorArr}`)
                }else{
                    res.send(error)
                }
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
                // console.log(updateData)
                res.redirect(`/home/${userData[0].randomizeInput()}`)
            })
            .catch(err=>{
                console.log(err)
                res.send(err)})
        
    }

    static getThreadDetail(req,res){
        const {comment,reaction} = req.query
        // console.log('comment',comment)
        let {userId,postId} = req.params
         postId = Post.passBreaker(postId)
         userId = User.passBreaker(userId)
        // console.log(postId,userId)
       
       
        function fillPage(postId){
            let userData
            let threadData
            let commentList
            let reactionList
            User.findOne({include:UserProfile,where:{
                userName:userId
            }}) 
                .then(data=>{
                    console.log(data)
                    userData = data
                    return Post.findByPk(postId,{
                        include:{
                            model:User,
                            include:{
                                model:UserProfile
                            }
                        }
                })
                })
                .then(data=>{
                    // console.log(data.User)
                    threadData = data
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
         
                    res.render('thread',{data:userData,threadData,comment:commentList,reaction:reactionList,reactDistinct})
    
                })
                .catch(err=>{
                    // console.log(err)
                    res.send(err)})
        }

        if (comment){
            User.findOne({where:{userName:userId}})
            .then(data=>{
                Comment.create({comment, PostId:postId,UserId:data.id})
            }).then(data=>{
                // console.log(data)
                fillPage(postId)
            })
        } else if(reaction){
            User.findOne({where:{userName:userId}})
            .then(data=>{
                Reaction.create({reaction, PostId:postId,UserId:data.id})
            }).then(data=>{
                // console.log(data)
                fillPage(postId)
            })
        }
        else{
            fillPage(postId)
        }
    }

    static logout(req,res){
   
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
              if (err) {
                return next(err);
              } else {
                return res.redirect('/');
              }
            });
          }
          
    }
}

module.exports = Controller