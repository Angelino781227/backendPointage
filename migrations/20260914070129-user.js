
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

      userBranch: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Departement', // À adapter au nom réel de ta table
          key: 'departementId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
