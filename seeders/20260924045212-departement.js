
'use strict';

module.exports = {
  async up(queryInterface) {
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
      createdAt: maintenant,
      updatedAt: maintenant,
    }));

    await queryInterface.bulkInsert('Departement', departements);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Departement', null, {});
  },
};
