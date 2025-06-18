'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'company',
      'company_company_name_key'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('company', {
      fields: ['company_name'],
      type: 'unique',
      name: 'company_company_name_key'
    });
  }
}; 