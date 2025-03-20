const { faker } = require('@faker-js/faker');
const Cars = require('../../models/Car');
const companyFactory = require('./companyFactory');
const companyExhibitionFactory = require('./companyExhibitionFactory');

const carsFactory = {
  async create(count = 1, attrs = {}) {
    const cars = [];
    
    // Create company if not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
      
      // Create exhibition if not provided
      if (!attrs.exhibition_id) {
        const exhibitions = await companyExhibitionFactory.create(1, { company_id: companies[0].company_id });
        attrs.exhibition_id = exhibitions[0].exhibition_id;
      }
    } else if (!attrs.exhibition_id) {
      // Create exhibition with the provided company_id
      const exhibitions = await companyExhibitionFactory.create(1, { company_id: attrs.company_id });
      attrs.exhibition_id = exhibitions[0].exhibition_id;
    }
    
    for (let i = 0; i < count; i++) {
      const carData = this.makeOne(attrs);
      cars.push(await Cars.create(carData));
    }
    
    return cars;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      model: faker.vehicle.model(),
      year: faker.number.int({ min: 2010, max: 2023 }),
      price_per_day: parseFloat(faker.commerce.price({ min: 30, max: 200 }))
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const cars = [];
    
    for (let i = 0; i < count; i++) {
      cars.push(this.makeOne(attrs));
    }
    
    return cars;
  }
};

module.exports = carsFactory;
