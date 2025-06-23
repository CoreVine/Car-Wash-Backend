'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('paymentmethod', 'public_key', {
      type: Sequelize.STRING(500),
      allowNull: false
    });
    
    await queryInterface.changeColumn('paymentmethod', 'secret_key', {
      type: Sequelize.STRING(500),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('paymentmethod', 'public_key', {
      type: Sequelize.STRING(100),
      allowNull: false
    });
    
    await queryInterface.changeColumn('paymentmethod', 'secret_key', {
      type: Sequelize.STRING(100),
      allowNull: false
    });
  }
}; 