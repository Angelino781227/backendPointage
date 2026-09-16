const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Departement = sequelize.define(
  'Departement',
  {
    nomDepartement: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Le nom du département est obligatoire' } },
    },
    chefDepartement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Le chef de département est obligatoire' } },
    },
    nombreEmploye: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'departements',
    timestamps: true,
  }
);

module.exports = Departement;
