'use strict';
const {
  Model
} = require('sequelize');
const {createPass} = require('../helper/helper');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile)
      User.hasMany(models.Post)
    }

    randomizeInput(){
      let strArr = this.userName.split('')
      let resKey =''
      strArr.forEach(el=>{
        resKey = resKey + el+ Math.floor(Math.random() * 10)
      })

      return resKey 

    }

    static passBreaker(value){
     let userNameStr=''
     for (let i = 0;i<value.length;i=i+2){
      console.log(i)
      userNameStr +=value[i]
     }
      return userNameStr
    }

  }
  User.init({
    email: DataTypes.STRING,
    userName: DataTypes.STRING,
    hashPassword: DataTypes.STRING
  }, {
    hooks:{
      beforeCreate:(user)=>{
        user.hashPassword = createPass(user.hashPassword)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};