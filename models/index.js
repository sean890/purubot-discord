'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    // old
    // equelize = new Sequelize(process.env[config.use_env_variable], config);

    // new
    sequelize = new Sequelize('postgres://iqezzwhocrduzj:f5c38d0f74cec1f0904ea5b0d1edac6026dde1f3324386a227ba365f5b16d876@ec2-54-81-37-115.compute-1.amazonaws.com:5432/d1geqa245p50dm?verifyServerCertificate=false&useSSL=true');
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
