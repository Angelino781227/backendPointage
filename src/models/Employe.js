
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
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Le CIN est obligatoire',
          },
        },
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
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Les prénoms sont obligatoires',
          },
        },
      },
      departementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'departements',
          key: 'departementId',
        },
        validate: {
          notNull: {
            msg: 'Le département est obligatoire',
          },
        },
      },
      fonction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La fonction est obligatoire',
          },
        },
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

  Employe.associate = (models) => {
    // Un employé appartient à un département.
    Employe.belongsTo(models.Departement, {
      foreignKey: 'departementId',
      as: 'departement',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // Un employé peut avoir plusieurs pointages.
    Employe.hasMany(models.Pointage, {
      foreignKey: 'employeId',
      onDelete: 'CASCADE',
    });
  };

  return Employe;
};
