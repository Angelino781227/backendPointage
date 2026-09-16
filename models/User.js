const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/db');
const Departement = require('./Departement');

const User = sequelize.define(
  'User',
  {
    userBranch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Departement,
        key: 'id',
      },
    },
    userRole: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // false = utilisateur standard, true = administrateur
    },
    userLogin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: { args: [3, 255], msg: "L'identifiant doit contenir au moins 3 caractères" },
      },
      set(valeur) {
        this.setDataValue('userLogin', valeur.trim().toLowerCase());
      },
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8, 255], msg: 'Le mot de passe doit contenir au moins 8 caractères' },
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['userPassword'] }, // masqué par défaut, comme select:false en Mongoose
    },
    scopes: {
      avecMotDePasse: { attributes: {} }, // à utiliser explicitement pour le login
    },
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('userPassword')) {
          const salt = await bcrypt.genSalt(10);
          user.userPassword = await bcrypt.hash(user.userPassword, salt);
        }
      },
    },
  }
);

// Méthode d'instance pour comparer un mot de passe en clair au hash stocké
User.prototype.comparerMotDePasse = async function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.userPassword);
};

// Relation : un département a plusieurs utilisateurs
Departement.hasMany(User, { foreignKey: 'userBranch' });
User.belongsTo(Departement, { foreignKey: 'userBranch' });

module.exports = User;
