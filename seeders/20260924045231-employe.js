
'use strict';

const { faker } = require('@faker-js/faker');

const fonctionsParDepartement = {
  Informatique: [
    'Développeur backend',
    'Développeuse frontend',
    'Administrateur système',
    'Chef de projet IT',
  ],
  'Ressources Humaines': [
    'Responsable RH',
    'Chargé de recrutement',
    'Gestionnaire de paie',
  ],
  Comptabilité: [
    'Comptable',
    'Contrôleur de gestion',
    'Auditeur interne',
  ],
  Logistique: [
    'Responsable stock',
    'Magasinier',
    'Coordinateur logistique',
  ],
  Marketing: [
    'Chargé de communication',
    'Responsable marketing',
    'Community manager',
  ],
  Production: [
    "Chef d'équipe",
    'Technicien de production',
    'Superviseur qualité',
  ],
};

const villes = [
  'Antananarivo',
  'Antsirabe',
  'Toamasina',
  'Fianarantsoa',
  'Mahajanga',
  'Toliara',
];

module.exports = {
  async up(queryInterface) {
    const departements = await queryInterface.sequelize.query(
      'SELECT id, nom FROM Departements',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (departements.length === 0) {
      throw new Error(
        'Aucun département. Exécute le seeder departement en premier.'
      );
    }

    const maintenant = new Date();
    const nombreEmployes = faker.number.int({ min: 5, max: 10 });

    const employes = Array.from({ length: nombreEmployes }, (_, i) => {
      const departement = faker.helpers.arrayElement(departements);

      return {
        matricule: `EMP-${String(i + 1).padStart(3, '0')}`,
        cin: faker.string.numeric(12),
        nom: faker.person.lastName(),
        prenoms: faker.person.firstName(),
        departementId: departement.id,
        fonction: faker.helpers.arrayElement(
          fonctionsParDepartement[departement.nom]
        ),
        telephone: faker.phone.number({ style: 'national' }),
        adresse: faker.helpers.arrayElement(villes),
        createdAt: maintenant,
        updatedAt: maintenant,
      };
    });

    await queryInterface.bulkInsert('Employe', employes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Employe', null, {});
  },
};
