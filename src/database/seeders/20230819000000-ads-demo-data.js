const adFactory = require('../factories/adFactory');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Create 5 sample ads with navigation links
      const ads = await adFactory.create(5, { 
        name: [
          'Summer Car Wash Discount',
          'Premium Car Maintenance',
          'New Car Rental Arrivals',
          'Special Weekend Offers',
          'Holiday Season Deals'
        ],
        link_url: [
          '/promotions/summer-discount',
          '/services/premium-maintenance',
          '/rentals/new-arrivals',
          '/promotions/weekend-offers',
          '/promotions/holiday-deals'
        ]
      });
      console.log(`Created ${ads.length} ads`);
    } catch (error) {
      console.error('Error seeding ads data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove ads data
    await queryInterface.bulkDelete('ads', null, {});
    console.log('All ads have been removed.');
  }
};
