'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Departement', {
      nomDepartement: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le nom du département est obligatoire' } },
      },
      chefDepartement: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le chef de département est obligatoire' } },
      },
      nombreEmploye: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'departements',
      timestamps: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Departement');
  }
};
