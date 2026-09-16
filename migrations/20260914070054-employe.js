'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Employe', {
      matricule: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le matricule est obligatoire' } },
      },
      cin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Le CIN est obligatoire' } },
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le nom est obligatoire' } },
      },
      prenoms: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Les prénoms sont obligatoires' } },
      },
      departement: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Le département est obligatoire' } },
      },
      fonction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'La fonction est obligatoire' } },
      },
      telephone: {
        type: DataTypes.STRING,
      },
      adresse: {
        type: DataTypes.STRING,
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
