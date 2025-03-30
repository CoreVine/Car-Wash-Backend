const { faker } = require('@faker-js/faker');
const WashType = require('../../models/WashType');
const companyFactory = require('./companyFactory');

const washTypeFactory = {
  async create(count = 1, attrs = {}) {
    const washTypes = [];
    
    // Handle the case where names are provided as an array
    let names = [];
    if (attrs.name && Array.isArray(attrs.name)) {
      names = [...attrs.name];
      delete attrs.name; // Remove name from attrs so it doesn't override our selection below
    }
    
    // Create company if not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    for (let i = 0; i < count; i++) {
      // Only use names array if it has elements
      let washName = undefined;
      if (names.length > 0) {
        washName = names[i % names.length];
      }
      
      const washTypeData = this.makeOne({
        ...attrs,
        name: washName
      });
      
      washTypes.push(await WashType.create(washTypeData));
    }
    
    return washTypes;
  },
  
  makeOne(attrs = {}) {
    const washTypeNames = [
      'Basic Wash',
      'Premium Wash',
      'Deluxe Wash',
      'Interior Cleaning',
      'Exterior Polish',
      'Full Service',
      'Express Wash',
      'Ultimate Package'
    ];
    
    const defaultAttrs = {
      name: faker.helpers.arrayElement(washTypeNames),
      price: faker.number.int({ min: 10, max: 100 }),
      description: faker.lorem.sentence()
    };
    
    // Make sure we don't overwrite with undefined/null
    return { ...defaultAttrs, ...attrs, name: attrs.name || defaultAttrs.name };
  },
  
  make(count = 1, attrs = {}) {
    const washTypes = [];
    
    for (let i = 0; i < count; i++) {
      washTypes.push(this.makeOne(attrs));
    }
    
    return washTypes;
  }
};

module.exports = washTypeFactory;
