const { faker } = require('@faker-js/faker');
const Employee = require('../../models/Employee');
const userFactory = require('./userFactory');
const companyFactory = require('./companyFactory');

const employeeFactory = {
  async create(count = 1, attrs = {}) {
    const employees = [];
    
    // Create users with employee type if user_id not provided
    if (!attrs.user_id) {
      const users = await userFactory.create(count, { acc_type: 'employee' });
      attrs.user_id = users[0].user_id;
    }
    
    // Create company if company_id not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    for (let i = 0; i < count; i++) {
      const employeeData = this.makeOne({
        ...attrs,
        user_id: Array.isArray(attrs.user_id) ? attrs.user_id[i] : attrs.user_id
      });
      employees.push(await Employee.create(employeeData));
    }
    
    return employees;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      role: faker.helpers.arrayElement(['super-admin', 'manager', 'employee']),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const employees = [];
    
    for (let i = 0; i < count; i++) {
      employees.push(this.makeOne(attrs));
    }
    
    return employees;
  }
};

module.exports = employeeFactory;
