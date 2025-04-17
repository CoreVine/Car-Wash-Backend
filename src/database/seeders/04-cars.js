const { initBeforeSeeding } = require('../seedHelper');
const { carsFactory, rentalCarsImagesFactory } = require('../factories');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Initialize database and models before seeding
      await initBeforeSeeding();
      
      // Create rental cars (for rent)
      const rentalCars = await carsFactory.create(10, {
        sale_or_rental: 'rent',
        description: 'Comfortable rental car with all amenities'
      });
      
      // Create cars for sale
      const saleCars = await carsFactory.create(10, {
        sale_or_rental: 'sale',
        description: 'Premium car for sale in excellent condition' 
      });
      
      // Add images to each car
      for (const car of [...rentalCars, ...saleCars]) {
        // Create 3-5 images per car
        const imageCount = Math.floor(Math.random() * 3) + 3;
        await rentalCarsImagesFactory.create(imageCount, { car_id: car.car_id });
      }
      
      console.log(`Created ${rentalCars.length} rental cars and ${saleCars.length} cars for sale`);
    } catch (error) {
      console.error('Error seeding cars:', error);
      throw error;
    }
  },
  
  async down(queryInterface, Sequelize) {
    try {
      // Remove seeded data
      await queryInterface.bulkDelete('rentalcarsimages', null, {});
      await queryInterface.bulkDelete('cars', null, {});
      console.log('Cars and their images removed successfully');
    } catch (error) {
      console.error('Error removing cars data:', error);
      throw error;
    }
  }
};
