'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class playground_profile_purus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  playground_profile_purus.init({
    user_id: DataTypes.STRING,
    purus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'playground_profile_purus',
  });
  return playground_profile_purus;
};