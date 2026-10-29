'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const maintenant = new Date();

    const departements = [
      'Informatique',
      'Ressources Humaines',
      'Comptabilité',
      'Logistique',
      'Marketing',
      'Production',
    ].map((nomDepartement) => ({
      nomDepartement,
      chefDepartementId: null,
      nombreEmploye: 0,
      createdAt: maintenant,
      updatedAt: maintenant,
    }));

    await queryInterface.bulkInsert('departements', departements);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departements', null, {});
  },
};