'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const departement = ['Informatique', 'Ressources Humaines', 'Comptabilité', 'Logistique', 'Marketing', 'Production'];

    for (let i = 0; i < 6; i++) {
      departement.push({
        
      });
      
      await queryInterface.bulkInsert('Departement', departement);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Departement', null, {});
  }
};
