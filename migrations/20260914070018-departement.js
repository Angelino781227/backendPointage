'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departements', {
      departementId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nomDepartement: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      // La clé étrangère sera ajoutée dans une migration ultérieure.
      chefDepartementId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      nombreEmploye: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('departements');
  },
};