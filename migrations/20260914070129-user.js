
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      userRole: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      userLogin: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      userPassword: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP'
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('User');
  },
};
