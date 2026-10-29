'use strict';

module.exports = (sequelize, DataTypes) => {
  const Employe = sequelize.define(
    'Employe',
    {
      employeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Le matricule est obligatoire',
          },
        },
      },

      cin: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Le nom est obligatoire',
          },
        },
      },

      prenoms: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      departementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'departements',
          key: 'departementId',
        },
      },

      fonction: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      adresse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'employe',
      timestamps: true,
    }
  );

  Employe.associate = (models) => {
    Employe.belongsTo(models.Departement, {
      foreignKey: 'departementId',
      as: 'departement',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    Employe.hasMany(models.Pointage, {
      foreignKey: 'employeId',
      onDelete: 'CASCADE',
    });
  };

  return Employe;
};