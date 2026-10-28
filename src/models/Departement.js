const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


module.exports = (sequelize, DataTypes) => {
  const Departement = sequelize.define(
    'Departement',
    {
      departementId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomDepartement: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Le nom du département est obligatoire',
          },
        },
      },
      chefDepartementId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Un département peut être créé sans chef
        references: {
          model: 'Employe',
          key: 'employeId',
        },
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

  Departement.associate = (models) => {
    Departement.hasMany(models.Employe, {
      foreignKey: 'departementId',
      onDelete: 'CASCADE'
    });
  };

  return Departement;
};

