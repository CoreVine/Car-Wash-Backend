const { faker } = require('@faker-js/faker');
const WashOrderWashType = require('../../models/WashOrderWashType');
const carWashOrdersFactory = require('./carWashOrdersFactory');
const washTypeFactory = require('./washTypeFactory');

const washOrderWashTypeFactory = {
  async create(count = 1, attrs = {}) {
    const washOrderWashTypes = [];
    
    // Use JS attribute names (order_id, type_id) instead of DB column names
    // Create carwashorder if not provided
    if (!attrs.order_id && !attrs.carwashorders_order_id) {
      console.log("Creating new car wash order for washOrderWashType...");
      const washOrders = await carWashOrdersFactory.create(1);
      attrs.order_id = washOrders[0].wash_order_id;
      console.log(`Created new car wash order with ID: ${attrs.order_id}`);
    } else if (attrs.carwashorders_order_id && !attrs.order_id) {
      // Map DB column name to JS attribute name
      attrs.order_id = attrs.carwashorders_order_id;
      delete attrs.carwashorders_order_id;
    }
    
    // Create washtype if not provided
    if (!attrs.type_id && !attrs.WashTypes_type_id) {
      console.log("Creating new wash type for washOrderWashType...");
      const washTypes = await washTypeFactory.create(1);
      attrs.type_id = washTypes[0].type_id;
      console.log(`Created new wash type with ID: ${attrs.type_id}`);
    } else if (attrs.WashTypes_type_id && !attrs.type_id) {
      // Map DB column name to JS attribute name
      attrs.type_id = attrs.WashTypes_type_id;
      delete attrs.WashTypes_type_id;
    }
    
    // Verify that we have both required IDs before proceeding
    if (!attrs.order_id || !attrs.type_id) {
      console.error("Missing required IDs:", {
        order_id: attrs.order_id,
        type_id: attrs.type_id
      });
      throw new Error('Both order_id and type_id are required for washOrderWashType creation');
    }
    
    console.log("Final attrs for WashOrderWashType creation:", {
      order_id: attrs.order_id,
      type_id: attrs.type_id,
      paid_price: attrs.paid_price || "using default"
    });
    
    for (let i = 0; i < count; i++) {
      const washOrderWashTypeData = this.makeOne(attrs);
      try {
        const created = await WashOrderWashType.create(washOrderWashTypeData);
        washOrderWashTypes.push(created);
        console.log(`Successfully created WashOrderWashType with IDs: ${created.order_id}/${created.type_id}`);
      } catch (error) {
        console.error('Failed to create washOrderWashType:', error.message);
        console.error('Data being used:', JSON.stringify(washOrderWashTypeData, null, 2));
        throw error;
      }
    }
    
    return washOrderWashTypes;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      paid_price: faker.number.int({ min: 30, max: 150 })
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
