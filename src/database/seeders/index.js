const { initBeforeSeeding } = require('../seedHelper');
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('Starting database migrations/seeding...');
      
      // Initialize database and models
      await initBeforeSeeding();
      
      // Get all seeder files in the directory (excluding this index.js file)
      const seedersDir = path.join(__dirname);
      const seedFiles = fs.readdirSync(seedersDir)
        .filter(file => 
          file.indexOf('.') !== 0 && 
          file !== 'index.js' && 
          file.slice(-3) === '.js'
        )
        .sort(); // Sort to ensure proper order
      
      console.log(`Found ${seedFiles.length} seeder files to run:`);
      seedFiles.forEach(file => console.log(`  - ${file}`));
      
      // Import and run each seeder
      for (const file of seedFiles) {
        if (file === 'index.js') continue;
        
        try {
          console.log(`Running seeder: ${file}`);
          const seeder = require(path.join(seedersDir, file));
          
          if (typeof seeder.up === 'function') {
            await seeder.up(queryInterface, Sequelize);
          } else {
            console.log(`Seeder ${file} does not have an 'up' method, skipping...`);
          }
        } catch (error) {
          console.error(`Error running seeder ${file}:`, error);
          throw error;
        }
      }
      
      console.log('Database migrations/seeding completed successfully');
    } catch (error) {
      console.error('Error during migration/seeding:', error);
      throw error;
    }
  },
  
  async down(queryInterface, Sequelize) {
    try {
      console.log('Reverting database migrations/seeding...');
      
      // Get all seeder files in the directory in reverse order
      const seedersDir = path.join(__dirname);
      const seedFiles = fs.readdirSync(seedersDir)
        .filter(file => 
          file.indexOf('.') !== 0 && 
          file !== 'index.js' && 
          file.slice(-3) === '.js'
        )
        .sort()
        .reverse(); // Reverse order for down migrations
      
      // Import and run each seeder
      for (const file of seedFiles) {
        if (file === 'index.js') continue;
        
        try {
          console.log(`Reverting seeder: ${file}`);
          const seeder = require(path.join(seedersDir, file));
          
          if (typeof seeder.down === 'function') {
            await seeder.down(queryInterface, Sequelize);
          } else {
            console.log(`Seeder ${file} does not have a 'down' method, skipping...`);
          }
        } catch (error) {
          console.error(`Error reverting seeder ${file}:`, error);
          throw error;
        }
      }
      
      console.log('Database migrations/seeding reverted successfully');
    } catch (error) {
      console.error('Error during migration/seeding reversion:', error);
      throw error;
    }
  }
};
