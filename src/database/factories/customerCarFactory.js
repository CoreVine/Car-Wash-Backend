const { faker } = require('@faker-js/faker');
const CustomerCar = require('../../models/CustomerCar');
const userFactory = require('./userFactory');

const customerCarFactory = {
  async create(count = 1, attrs = {}) {
    const customerCars = [];
    
    // Create customer if not provided
    if (!attrs.customer_id) {
      const users = await userFactory.create(1);
      attrs.customer_id = users[0].user_id;
    }
    
    for (let i = 0; i < count; i++) {
      const customerCarData = this.makeOne(attrs);
      customerCars.push(await CustomerCar.create(customerCarData));
    }
    
    return customerCars;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      model: faker.vehicle.model(),
      car_plate_number: faker.vehicle.vrm() // Vehicle Registration Mark
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const customerCars = [];
    
    for (let i = 0; i < count; i++) {
      customerCars.push(this.makeOne(attrs));
    }
    
    return customerCars;
  }
};

module.exports = customerCarFactory;
