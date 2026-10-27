const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Employe } = require('../models');

module.exports = (sequelize, DataTypes) => {
  const Pointage = sequelize.define(
    'Pointage',
    {
      employeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          estJourOuvre(valeur) {
            const jour = new Date(valeur).getDay(); // 0 = dimanche, 6 = samedi
            if (jour === 0 || jour === 6) {
              throw new Error(
                'Le pointage ne peut concerner que les jours ouvrés (lundi à vendredi)'
              );
            }
          },
        },
      },
      arriveeMatin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      departMatin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      arriveeApresMidi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      departApresMidi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'pointages',
      timestamps: true,
      indexes: [
        // Un seul pointage par employé et par jour
        { unique: true, fields: ['employeId', 'date'] },
      ],
    }
  );
  Pointage.associate = (models) => {
    Pointage.belongsTo(models.Employe, {
      foreignKey: 'employeId',
    });
  };

  return Pointage;
};
