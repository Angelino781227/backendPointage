
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
    const { QueryTypes } = queryInterface.sequelize;

    const departements = await queryInterface.sequelize.query(
      'SELECT departementId, nomDepartement FROM departements',
      { type: QueryTypes.SELECT }
    );

    if (departements.length === 0) {
      throw new Error(
        'Aucun département. Exécute le seeder des départements en premier.'
      );
    }

    // Vérifier que les fonctions sont définies pour chaque département.
    for (const departement of departements) {
      if (!fonctionsParDepartement[departement.nomDepartement]) {
        throw new Error(
          `Aucune fonction définie pour le département ${departement.nomDepartement}.`
        );
      }
    }

    const maintenant = new Date();
    const nombreEmployes = faker.number.int({ min: 30, max: 45 });

    const employes = Array.from(
      { length: nombreEmployes },
      (_, i) => {
        const departement = faker.helpers.arrayElement(departements);

        return {
          matricule: `EMP-${String(i + 1).padStart(3, '0')}`,
          cin: faker.string.numeric(12),
          nom: faker.person.lastName(),
          prenoms: faker.person.firstName(),

          // Nouvelle relation par clé étrangère
          departementId: departement.departementId,

          fonction: faker.helpers.arrayElement(
            fonctionsParDepartement[departement.nomDepartement]
          ),
          telephone: faker.phone.number({ style: 'national' }),
          adresse: faker.helpers.arrayElement(villes),
          createdAt: maintenant,
          updatedAt: maintenant,
        };
      }
    );

    await queryInterface.bulkInsert('Employe', employes);

    // Actualiser les effectifs après insertion.
    for (const departement of departements) {
      const resultat = await queryInterface.sequelize.query(
        `SELECT COUNT(*) AS total
         FROM Employe
         WHERE departementId = :departementId`,
        {
          replacements: {
            departementId: departement.departementId,
          },
          type: QueryTypes.SELECT,
        }
      );

      await queryInterface.bulkUpdate(
        'departements',
        {
          nombreEmploye: Number(resultat[0].total),
          updatedAt: maintenant,
        },
        {
          departementId: departement.departementId,
        }
      );
    }

    // Aucun chef n'est attribué automatiquement.
    // Le chef sera choisi manuellement depuis l'application.
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Employe', null, {});
    await queryInterface.bulkUpdate(
      'departements',
      { nombreEmploye: 0, chefDepartementId: null },
      {}
    );
  },
};
