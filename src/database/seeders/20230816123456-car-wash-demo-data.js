const userFactory = require('../factories/userFactory');
const companyFactory = require('../factories/companyFactory');
const employeeFactory = require('../factories/employeeFactory');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Create 10 regular users
      const users = await userFactory.create(10, { acc_type: 'user' });
      console.log(`Created ${users.length} regular users`);
      
      // Create 3 companies
      const companies = await companyFactory.create(3, { approved: 1 });
      console.log(`Created ${companies.length} companies`);
      
      // Create employees for each company
      for (const company of companies) {
        // Create 1 super-admin, 2 managers, and 3 employees for each company
        const employeeUsers = await userFactory.create(6, { acc_type: 'employee' });
        
        await employeeFactory.create(1, { 
          user_id: employeeUsers[0].user_id,
          company_id: company.company_id,
          role: 'super-admin'
        });
        
        await employeeFactory.create(2, { 
          user_id: [employeeUsers[1].user_id, employeeUsers[2].user_id],
          company_id: company.company_id,
          role: 'manager'
        });
        
        await employeeFactory.create(3, { 
          user_id: [employeeUsers[3].user_id, employeeUsers[4].user_id, employeeUsers[5].user_id],
          company_id: company.company_id,
          role: 'employee'
        });
      }
      console.log(`Created employees for all companies`);
      
      // Add more seed data for other tables here...
      
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove data in reverse order of dependencies
      console.log('Removing washorders_washtypes data...');
      await queryInterface.bulkDelete('washorders_washtypes', null, {});
      
      console.log('Removing WashTypes data...');
      await queryInterface.bulkDelete('WashTypes', null, {});
      
      console.log('Removing washorderoperation data...');
      await queryInterface.bulkDelete('washorderoperation', null, {});
      
      console.log('Removing orderstatushistory data...');
      await queryInterface.bulkDelete('orderstatushistory', null, {});
      
      console.log('Removing rentalorders data...');
      await queryInterface.bulkDelete('rentalorders', null, {});
      
      console.log('Removing carwashorders data...');
      await queryInterface.bulkDelete('carwashorders', null, {});
      
      console.log('Removing orderitems data...');
      await queryInterface.bulkDelete('orderitems', null, {});
      
      console.log('Removing orders data...');
      await queryInterface.bulkDelete('orders', null, {});
      
      console.log('Removing rentalcarsimages data...');
      await queryInterface.bulkDelete('rentalcarsimages', null, {});
      
      console.log('Removing cars data...');
      await queryInterface.bulkDelete('cars', null, {});
      
      console.log('Removing companyexhibition data...');
      await queryInterface.bulkDelete('companyexhibition', null, {});
      
      console.log('Removing productsimages data...');
      await queryInterface.bulkDelete('productsimages', null, {});
      
      console.log('Removing subcatproduct data...');
      await queryInterface.bulkDelete('subcatproduct', null, {});
      
      console.log('Removing products data...');
      await queryInterface.bulkDelete('products', null, {});
      
      console.log('Removing subcategory data...');
      await queryInterface.bulkDelete('subcategory', null, {});
      
      console.log('Removing category data...');
      await queryInterface.bulkDelete('category', null, {});
      
      console.log('Removing customercar data...');
      await queryInterface.bulkDelete('customercar', null, {});
      
      console.log('Removing companydocuments data...');
      await queryInterface.bulkDelete('companydocuments', null, {});
      
      console.log('Removing ratings data...');
      await queryInterface.bulkDelete('ratings', null, {});
      
      console.log('Removing employee data...');
      await queryInterface.bulkDelete('employee', null, {});
      
      console.log('Removing company data...');
      await queryInterface.bulkDelete('company', null, {});
      
      console.log('Removing users data...');
      await queryInterface.bulkDelete('users', null, {});
      
      console.log('Removing paymentmethod data...');
      await queryInterface.bulkDelete('paymentmethod', null, {});
      
      console.log('All data has been removed.');
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }
};
