const { initBeforeSeeding } = require('../seedHelper');
const { cartFactory, orderFactory, orderStatusHistoryFactory, orderItemsFactory } = require('../factories');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Initialize database and models before seeding
      await initBeforeSeeding();
      
      // Create active carts (shopping carts)
      const activeCarts = await cartFactory.create(5, {
        status: 'cart'
      });
      
      // Add items to active carts
      for (const cart of activeCarts) {
        // Add 1-5 items to each cart
        const itemCount = Math.floor(Math.random() * 5) + 1;
        await orderItemsFactory.create(itemCount, { 
          order_id: cart.order_id
        });
      }
      
      // Create pending carts (orders in progress)
      const pendingCarts = await cartFactory.create(8, {
        status: 'pending'
      });
      
      // Create completed carts
      const completedCarts = await cartFactory.create(12, {
        status: 'complete'
      });
      
      // Create orders for pending and completed carts
      const allOrderCarts = [...pendingCarts, ...completedCarts];
      
      for (const cart of allOrderCarts) {
        // Create order
        const order = await orderFactory.create(1, {
          cart_order_id: cart.order_id
        });
        
        // Add order status history
        if (cart.status === 'complete') {
          // For completed orders, add both pending and complete status
          await orderStatusHistoryFactory.create(1, {
            order_id: order[0].id,
            status: 'pending',
            timestamp: faker.date.past({ days: 14 })
          });
          
          await orderStatusHistoryFactory.create(1, {
            order_id: order[0].id,
            status: 'complete',
            timestamp: faker.date.recent()
          });
        } else {
          // For pending orders, just add pending status
          await orderStatusHistoryFactory.create(1, {
            order_id: order[0].id,
            status: 'pending'
          });
        }
        
        // Add order items
        const itemCount = Math.floor(Math.random() * 3) + 1;
        await orderItemsFactory.create(itemCount, { 
          order_id: cart.order_id
        });
      }
      
      console.log(`Created ${activeCarts.length} active carts`);
      console.log(`Created ${pendingCarts.length} pending orders`);
      console.log(`Created ${completedCarts.length} completed orders`);
    } catch (error) {
      console.error('Error seeding carts and orders:', error);
      throw error;
    }
  },
  
  async down(queryInterface, Sequelize) {
    try {
      // Remove seeded data
      await queryInterface.bulkDelete('orderstatushistory', null, {});
      await queryInterface.bulkDelete('order', null, {});
      await queryInterface.bulkDelete('orderitems', null, {});
      await queryInterface.bulkDelete('cart', null, {});
      console.log('Carts, orders, and related data removed successfully');
    } catch (error) {
      console.error('Error removing carts and orders data:', error);
      throw error;
    }
  }
};
