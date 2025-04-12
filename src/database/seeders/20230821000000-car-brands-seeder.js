const { initBeforeSeeding } = require('../seedHelper');
const factories = require('../factories');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Starting car brands seeding...');
    
    // Initialize database and models before seeding
    await initBeforeSeeding();
    
    try {
      // Create car brands
      const carBrandNames = [
        'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 
        'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Nissan',
        'Volkswagen', 'Lexus', 'Mazda', 'Subaru', 'Tesla'
      ];
      
      const brands = await factories.carBrandFactory.create(carBrandNames.length, {
        name: carBrandNames
      });
      console.log(`Created ${brands.length} car brands`);
      
      // Get all cars from database
      const cars = await queryInterface.sequelize.query(
        'SELECT car_id, model FROM cars',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (cars.length > 0) {
        console.log(`Found ${cars.length} cars to associate with brands`);
        
        for (const car of cars) {
          // Find a matching brand based on car model name
          let matchedBrand = null;
          for (const brand of brands) {
            if (car.model.toLowerCase().includes(brand.name.toLowerCase())) {
              matchedBrand = brand;
              break;
            }
          }
          
          // If no match found, assign a random brand
          if (!matchedBrand) {
            const randomIndex = Math.floor(Math.random() * brands.length);
            matchedBrand = brands[randomIndex];
          }
          
          // Update car with brand ID
          await queryInterface.sequelize.query(
            `UPDATE cars SET carbrand_id = ${matchedBrand.brand_id} WHERE car_id = ${car.car_id}`
          );
          
          console.log(`Associated car ${car.model} (ID: ${car.car_id}) with brand ${matchedBrand.name}`);
        }
      }
      
      console.log('Car brands seeding completed successfully!');
      
    } catch (error) {
      console.error('Error seeding car brands:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Set all cars' carbrand_id to NULL 
      await queryInterface.sequelize.query(
        'UPDATE cars SET carbrand_id = NULL'
      );
      console.log('Removed brand associations from all cars');
      
      // Delete all car brands
      await queryInterface.bulkDelete('carbrand', null, {});
      console.log('All car brands have been removed');
    } catch (error) {
      console.error('Error removing car brands:', error);
      throw error;
    }
  }
};
