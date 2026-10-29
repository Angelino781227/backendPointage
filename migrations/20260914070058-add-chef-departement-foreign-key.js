'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('departements', {
      fields: ['chefDepartementId'],
      type: 'foreign key',
      name: 'fk_departements_chef_employe',
      references: {
        table: 'employe',
        field: 'employeId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'departements',
      'fk_departements_chef_employe'
    );
  },
};