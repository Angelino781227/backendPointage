'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = [];

    for (let i = 0; i < 6; i++) {
      user.push({

      });
      
      await queryInterface.bulkInsert('User', user);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
