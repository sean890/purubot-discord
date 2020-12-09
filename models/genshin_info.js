'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genshin_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  genshin_info.init({
    keyword: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'genshin_info',
  });
  return genshin_info;
};