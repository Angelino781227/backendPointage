const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const Employe = sequelize.define(
    'Employe',
    {
      employeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le matricule est obligatoire' } },
      },
      cin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le CIN est obligatoire' } },
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le nom est obligatoire' } },
      },
      prenoms: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Les prénoms sont obligatoires' } },
      },
      departement: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le département est obligatoire' } },
      },
      fonction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'La fonction est obligatoire' } },
      },
      telephone: {
        type: DataTypes.STRING,
      },
      adresse: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'employe',
      timestamps: true,
    }
  );

  return Employe;
};
