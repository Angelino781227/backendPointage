
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Vérifier si le compte existe déjà.
    const [users] = await queryInterface.sequelize.query(
      "SELECT userId FROM user WHERE userLogin = 'admin'"
    );

    if (users.length > 0) {
      console.log('Le compte admin existe déjà.');
      return;
    }

    // Récupérer un département existant.
    const [departements] = await queryInterface.sequelize.query(
      'SELECT departementId FROM Departement ORDER BY departementId ASC LIMIT 1'
    );

    if (departements.length === 0) {
      throw new Error(
        'Aucun département trouvé. Exécute le seeder Departement avant celui-ci.'
      );
    }

    // Mot de passe de démonstration uniquement.
    const motDePasse = process.env.SEED_ADMIN_PASSWORD;

    if (!motDePasse || motDePasse.length < 12) {
      throw new Error(
        'Définis SEED_ADMIN_PASSWORD avec au moins 12 caractères dans ton environnement.'
      );
    }

    const hash = await bcrypt.hash(motDePasse, 12);
    const maintenant = new Date();

    await queryInterface.bulkInsert('user', [
      {
        userBranch: departements[0].id,
        userRole: true,
        userLogin: 'admin',
        userPassword: hash,
        createdAt: maintenant,
        updatedAt: maintenant,
      },
    ]);

    console.log('Compte administrateur créé avec succès.');
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'user',
      { userLogin: 'admin' },
      {}
    );
  },
};
