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
    // Remove data in reverse order of dependencies
    await queryInterface.bulkDelete('Employee', null, {});
    await queryInterface.bulkDelete('Company', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
