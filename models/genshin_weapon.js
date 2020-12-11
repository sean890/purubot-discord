'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genshin_weapon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  genshin_weapon.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    rarity: DataTypes.STRING,
    atk: DataTypes.STRING,
    secondary: DataTypes.STRING,
    effect: DataTypes.STRING,
    obtain: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'genshin_weapon',
  });
  return genshin_weapon;
};