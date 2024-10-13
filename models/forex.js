const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('forex', 'shoppingapi', 'test@123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

const ForexRate = sequelize.define('ForexRate', {
  currencyPair: { type: DataTypes.STRING, allowNull: false },
  rate: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
});


const CurrencyPair = sequelize.define('CurrencyPair', {
    pair: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., 'GBP/USD'
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true } // Flag to track active pairs
  });
  
  module.exports = { ForexRate, CurrencyPair,sequelize };