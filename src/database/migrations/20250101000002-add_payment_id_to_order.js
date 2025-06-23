'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('order', 'payment_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'payment_method_id'
    });
    
    await queryInterface.addColumn('order', 'payment_status', {
      type: Sequelize.ENUM('pending', 'paid', 'failed', 'cancelled'),
      allowNull: true,
      defaultValue: 'pending',
      after: 'payment_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('order', 'payment_status');
    await queryInterface.removeColumn('order', 'payment_id');
  }
}; 