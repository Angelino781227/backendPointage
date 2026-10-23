'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const employe = [];

    const fonctionsParDepartement = {
      'Informatique': ['Développeur backend', 'Développeuse frontend', 'Administrateur système', 'Chef de projet IT'],
      'Ressources Humaines': ['Responsable RH', 'Chargé de recrutement', 'Gestionnaire de paie'],
      'Comptabilité': ['Comptable', 'Contrôleur de gestion', 'Auditeur interne'],
      'Logistique': ['Responsable stock', 'Magasinier', 'Coordinateur logistique'],
      'Marketing': ['Chargé de communication', 'Responsable marketing', 'Community manager'],
      'Production': ["Chef d'équipe", 'Technicien de production', 'Superviseur qualité'],
    };

    for (let i = 0; i < 6; i++) {
      employe.push({
        
      });

      await queryInterface.bulkInsert('Employe', employe);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employe', null, {});
  }
};
