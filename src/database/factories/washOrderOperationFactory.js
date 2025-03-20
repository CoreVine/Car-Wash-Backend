const { faker } = require('@faker-js/faker');
const WashOrderOperation = require('../../models/WashOrderOperation');
const carWashOrdersFactory = require('./carWashOrdersFactory');
const employeeFactory = require('./employeeFactory');

const washOrderOperationFactory = {
  async create(count = 1, attrs = {}) {
    const operations = [];
    
    // Create related entities if needed
    let washOrder, employee;
    
    if (!attrs.wash_order_id) {
      washOrder = (await carWashOrdersFactory.create(1))[0];
      attrs.wash_order_id = washOrder.wash_order_id;
    }
    
    if (!attrs.employee_assigned_id || !attrs.company_id) {
      employee = (await employeeFactory.create(1))[0];
      attrs.employee_assigned_id = employee.user_id;
      attrs.company_id = employee.company_id;
    }
    
    for (let i = 0; i < count; i++) {
      const operationData = this.makeOne(attrs);
      operations.push(await WashOrderOperation.create(operationData));
    }
    
    return operations;
  },
  
  makeOne(attrs = {}) {
    const startDate = faker.date.recent();
    // 50% chance of having a completion date
    const endDate = faker.datatype.boolean() 
      ? faker.date.between({ from: startDate, to: new Date() }) 
      : null;
      
    const defaultAttrs = {
      operation_start_at: startDate,
      operation_done_at: endDate
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const operations = [];
    
    for (let i = 0; i < count; i++) {
      operations.push(this.makeOne(attrs));
    }
    
    return operations;
  }
};

module.exports = washOrderOperationFactory;
