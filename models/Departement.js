const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/db');

module.exports = (sequelize, DataTypes) => {
  const Departement = sequelize.define(
    'Departement',
    {
      departementId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
};
