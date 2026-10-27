
'use strict';

const { faker } = require('@faker-js/faker');

function getJoursOuvresSemaine() {
  const jours = [];
  const aujourdHui = new Date();
  const jourSemaine = aujourdHui.getDay();

  const lundi = new Date(aujourdHui);
  lundi.setDate(
    aujourdHui.getDate() + (jourSemaine === 0 ? -6 : 1 - jourSemaine)
  );

  for (let i = 0; i < 5; i++) {
    const jour = new Date(lundi);
    jour.setDate(lundi.getDate() + i);
    jours.push(jour.toISOString().split('T')[0]);
  }

  return jours;
}

module.exports = {
  async up(queryInterface) {
    const employes = await queryInterface.sequelize.query(
      'SELECT employeId FROM Employe',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (employes.length === 0) {
      throw new Error(
        'Aucun employé. Exécute le seeder employe en premier.'
      );
    }

    const jours = getJoursOuvresSemaine();
    const maintenant = new Date();
    const pointages = [];

    for (const employe of employes) {
      for (const jour of jours) {
        const tauxPresence = faker.number.float({
          min: 0.75,
          max: 0.95,
        });

        const present = Math.random() < tauxPresence;

        pointages.push({
          employeId: employe.employeId,
          date: jour,
          arriveeMatin: present,
          departMatin: present && Math.random() > 0.05,
          arriveeApresMidi: present && Math.random() > 0.1,
          departApresMidi: present && Math.random() > 0.05,
          createdAt: maintenant,
          updatedAt: maintenant,
        });
      }
    }

    await queryInterface.bulkInsert('Pointage', pointages);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Pointage', null, {});
  },
};
