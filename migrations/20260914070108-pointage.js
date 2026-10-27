'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Pointage', {
      employeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          estJourOuvre(valeur) {
            const jour = new Date(valeur).getDay(); // 0 = dimanche, 6 = samedi
            if (jour === 0 || jour === 6) {
              throw new Error(
                'Le pointage ne peut concerner que les jours ouvrés (lundi à vendredi)'
              );
            }
          },
        },
      },
      arriveeMatin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      departMatin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      arriveeApresMidi: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      departApresMidi: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Pointage');
  }
};
