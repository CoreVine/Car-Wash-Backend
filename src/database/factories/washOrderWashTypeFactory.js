const { faker } = require('@faker-js/faker');
const WashOrderWashType = require('../../models/WashOrderWashType');
const carWashOrdersFactory = require('./carWashOrdersFactory');
const washTypeFactory = require('./washTypeFactory');

const washOrderWashTypeFactory = {
  async create(count = 1, attrs = {}) {
    const washOrderWashTypes = [];
    
    // Create car wash order if not provided
    if (!attrs.carwashorders_order_id) {
      const washOrders = await carWashOrdersFactory.create(1);
      attrs.carwashorders_order_id = washOrders[0].wash_order_id;
    }
    
    // Create wash type if not provided
    if (!attrs.WashTypes_type_id) {
      const washTypes = await washTypeFactory.create(1);
      attrs.WashTypes_type_id = washTypes[0].type_id;
    }
    
    for (let i = 0; i < count; i++) {
      const washOrderWashTypeData = this.makeOne(attrs);
      washOrderWashTypes.push(await WashOrderWashType.create(washOrderWashTypeData));
    }
    
    return washOrderWashTypes;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      paid_price: faker.number.int({ min: 10, max: 200 })
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const washOrderWashTypes = [];
    
    for (let i = 0; i < count; i++) {
      washOrderWashTypes.push(this.makeOne(attrs));
    }
    
    return washOrderWashTypes;
  }
};

module.exports = washOrderWashTypeFactory;
