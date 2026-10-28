'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Departement', {
      departementId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nomDepartement: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le nom du département est obligatoire' } },
      },
      chefDepartementId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Employe',
          key: 'employeId',
        },
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
