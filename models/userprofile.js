'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User)
    }

    get getDate(){
      return this.dateOfBirth.toISOString().split('T')[0]
    }
  }
  UserProfile.init({
    name: {
      type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:{
        msg:'Name not Empty'
      }
    }
},
    dateOfBirth: {
      type:DataTypes.DATE,
    allowNull:false,
    validate:{
      notEmpty:{
        msg:'date of birth not Empty'
      }
    }
},
    profileImageUrl: {
      type:DataTypes.STRING,
    allowNull:true,
    validate:{
      notEmpty:{
        msg:'profile image not Empty'
      }
    }
},
    shortProfile: {
      type:DataTypes.TEXT,
    allowNull:false,
    validate:{
      notEmpty:{
        msg:'short profile not Empty'
      }
    }
},
    UserId: {
      type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
      notEmpty:{
        msg:'UserId not Empty'
      }
    }
}
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};