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
    name: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    profileImageUrl: DataTypes.STRING,
    shortProfile: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};