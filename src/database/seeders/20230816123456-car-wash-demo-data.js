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
      
      console.log('Removing WashOrderOperation data...');
      await queryInterface.bulkDelete('WashOrderOperation', null, {});
      
      console.log('Removing OrderStatusHistory data...');
      await queryInterface.bulkDelete('OrderStatusHistory', null, {});
      
      console.log('Removing RentalOrders data...');
      await queryInterface.bulkDelete('RentalOrders', null, {});
      
      console.log('Removing CarWashOrders data...');
      await queryInterface.bulkDelete('CarWashOrders', null, {});
      
      console.log('Removing OrderItems data...');
      await queryInterface.bulkDelete('OrderItems', null, {});
      
      console.log('Removing Orders data...');
      await queryInterface.bulkDelete('Orders', null, {});
      
      console.log('Removing RentalCarsImages data...');
      await queryInterface.bulkDelete('RentalCarsImages', null, {});
      
      console.log('Removing Cars data...');
      await queryInterface.bulkDelete('Cars', null, {});
      
      console.log('Removing CompanyExhibition data...');
      await queryInterface.bulkDelete('CompanyExhibition', null, {});
      
      console.log('Removing ProductsImages data...');
      await queryInterface.bulkDelete('ProductsImages', null, {});
      
      console.log('Removing SubCatProduct data...');
      await queryInterface.bulkDelete('SubCatProduct', null, {});
      
      console.log('Removing Products data...');
      await queryInterface.bulkDelete('Products', null, {});
      
      console.log('Removing SubCategory data...');
      await queryInterface.bulkDelete('SubCategory', null, {});
      
      console.log('Removing Category data...');
      await queryInterface.bulkDelete('Category', null, {});
      
      console.log('Removing CustomerCar data...');
      await queryInterface.bulkDelete('CustomerCar', null, {});
      
      console.log('Removing CompanyDocuments data...');
      await queryInterface.bulkDelete('CompanyDocuments', null, {});
      
      console.log('Removing Ratings data...');
      await queryInterface.bulkDelete('Ratings', null, {});
      
      console.log('Removing Employee data...');
      await queryInterface.bulkDelete('Employee', null, {});
      
      console.log('Removing Company data...');
      await queryInterface.bulkDelete('Company', null, {});
      
      console.log('Removing Users data...');
      await queryInterface.bulkDelete('Users', null, {});
      
      console.log('Removing PaymentMethod data...');
      await queryInterface.bulkDelete('PaymentMethod', null, {});
      
      console.log('All data has been removed.');
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }
};
