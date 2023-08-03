'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.Comment)
      Post.hasMany(models.Reaction)
      // Post.belongsToMany(models.User,{through:models.Comment})
      // Post.belongsToMany(models.User,{through:models.Reaction})
      // ,foreignKey:models.Comment.PostId
      // ,foreignKey:models.Reaction.PostId
    }

    randomizeInput(){
      let strArr = this.title.split('')
      let resKey ='' +this.id+'_'
      strArr.forEach(el=>{
        resKey = resKey + el+ Math.floor(Math.random() * 10)
      })

      return resKey 

    }

    static passBreaker(value){
     let postId =Number(value.split('_')[0])
      return postId
    }
  }
  Post.init({
    title: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:'title not Empty'
        }
      }},
    content: {type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:'content not Empty'
        }
      }},
    photoUrl: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};