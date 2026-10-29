'use strict';

const { faker } = require('@faker-js/faker');
const { QueryTypes } = require('sequelize');

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
    await queryInterface.sequelize.transaction(async (transaction) => {
      const departements = await queryInterface.sequelize.query(
        `SELECT departementId, nomDepartement FROM departements`,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (departements.length === 0) {
        throw new Error(
          'Aucun département trouvé. Exécute le seeder des départements en premier.'
        );
      }

      const maintenant = new Date();
      let compteur = 1;
      const employes = [];
      const chefsProvisoires = [];

      // 1. Créer un employé provisoire pour chaque département.
      for (const departement of departements) {
        const matricule = `EMP-${String(compteur++).padStart(3, '0')}`;

        employes.push({
          matricule,
          nom: 'À compléter',
          prenoms: null,
          cin: null,
          fonction: null,
          departementId: departement.departementId,
          telephone: null,
          adresse: null,
          createdAt: maintenant,
          updatedAt: maintenant,
        });

        chefsProvisoires.push({
          departementId: departement.departementId,
          matricule,
        });
      }

      // 2. Ajouter des employés de démonstration.
      const nombreTotal = Math.max(
        departements.length,
        faker.number.int({ min: 30, max: 45 })
      );

      while (employes.length < nombreTotal) {
        const departement = faker.helpers.arrayElement(departements);
        const fonctions =
          fonctionsParDepartement[departement.nomDepartement] || [
            'Employé',
          ];

        employes.push({
          matricule: `EMP-${String(compteur++).padStart(3, '0')}`,
          cin: faker.string.numeric(12),
          nom: faker.person.lastName(),
          prenoms: faker.person.firstName(),
          fonction: faker.helpers.arrayElement(fonctions),
          departementId: departement.departementId,
          departement: departement.nomDepartement,
          telephone: faker.phone.number({ style: 'national' }),
          adresse: faker.helpers.arrayElement(villes),
          createdAt: maintenant,
          updatedAt: maintenant,
        });
      }

      await queryInterface.bulkInsert('employe', employes, {
        transaction,
      });

      // 3. Désigner le premier employé de chaque département comme chef.
      for (const chef of chefsProvisoires) {
        const resultat = await queryInterface.sequelize.query(
          `SELECT employeId
           FROM employe
           WHERE matricule = :matricule`,
          {
            replacements: { matricule: chef.matricule },
            type: QueryTypes.SELECT,
            transaction,
          }
        );

        if (!resultat.length) {
          throw new Error(
            `Employé provisoire introuvable : ${chef.matricule}`
          );
        }

        await queryInterface.bulkUpdate(
          'departements',
          {
            chefDepartementId: resultat[0].employeId,
          },
          {
            departementId: chef.departementId,
          },
          { transaction }
        );
      }

      // 4. Recalculer le nombre réel d'employés de chaque département.
      for (const departement of departements) {
        const resultat = await queryInterface.sequelize.query(
          `SELECT COUNT(*) AS total
           FROM employe
           WHERE departementId = :departementId`,
          {
            replacements: {
              departementId: departement.departementId,
            },
            type: QueryTypes.SELECT,
            transaction,
          }
        );

        await queryInterface.bulkUpdate(
          'departements',
          {
            nombreEmploye: Number(resultat[0].total),
          },
          {
            departementId: departement.departementId,
          },
          { transaction }
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('employe', null, {
        transaction,
      });

      await queryInterface.bulkUpdate(
        'departements',
        {
          chefDepartementId: null,
          nombreEmploye: 0,
        },
        {},
        { transaction }
      );
    });
  },
};