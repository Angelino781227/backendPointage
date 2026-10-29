'use strict';

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
        allowNull: true,
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
      as: 'employes',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    Departement.belongsTo(models.Employe, {
      foreignKey: 'chefDepartementId',
      as: 'chef',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Departement;
};