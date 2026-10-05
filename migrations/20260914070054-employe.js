'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Employe', {
      employeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      matricule: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le matricule est obligatoire' } },
      },
      cin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le CIN est obligatoire' } },
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le nom est obligatoire' } },
      },
      prenoms: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Les prénoms sont obligatoires' } },
      },
      departement: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le département est obligatoire' } },
      },
      fonction: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'La fonction est obligatoire' } },
      },
      telephone: {
        type: Sequelize.STRING,
      },
      adresse: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Employe');
  }
};
