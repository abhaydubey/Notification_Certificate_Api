'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.SecurityGroup.hasOne(User, { foreignKey: 'securityGroupId' });

      User.belongsTo(models.SecurityGroup, { as: 'securityGroup' });

    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      required: true
    },
    middleName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING,
      required: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    mobile: {
      type: DataTypes.STRING,
      required: true
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['MALE', 'FEMALE', 'OTHER']
    },
    role: {
      type: DataTypes.ENUM,
      values: ['STUDENT', 'TEACHER'],
      defaultValue: 'STUDENT'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      required: true
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
    referralCode: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    isFirstLogin: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: true
    },
    isChatActive: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: true
    },
    lastActive: {
      type: DataTypes.DATE,
      required: true,
      defaultValue: new Date()
    },
    createdBy: {
      type: DataTypes.STRING,
      required: true
    },
    updatedBy: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};