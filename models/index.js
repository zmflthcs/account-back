'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Category = require('./category')(sequelize, Sequelize);
db.Record = require('./record')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

db.User.hasMany(db.Category, {foreignKey: {name: 'fk_user'}, allowNull: false});
db.Category.belongsTo(db.User,{foreignKey: {name: 'fk_user'}, allowNull: false})

db.Category.hasMany(db.Record, {foreignKey: 'fk_category'});
db.Record.belongsTo(db.Category, {foreignKey: 'fk_category'})



module.exports = db;
