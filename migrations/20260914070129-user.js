'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      userBranch: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /*references: {
          model: Departement,
          key: 'id',
        },*/
      },
      userRole: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = utilisateur standard, true = administrateur
      },
      userLogin: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: { args: [8, 255], msg: 'Le mot de passe doit contenir au moins 8 caractères' },
        },
      },
    }, {
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
