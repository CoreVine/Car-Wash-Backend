const { faker } = require('@faker-js/faker');
const Car = require('../../models/Car');
const companyFactory = require('./companyFactory');
const companyExhibitionFactory = require('./companyExhibitionFactory');
const carBrandFactory = require('./carBrandFactory');

const carsFactory = {
  async create(count = 1, attrs = {}) {
    const cars = [];
    
    // Create company if company_id not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    // Create exhibition if exhibition_id not provided
    if (!attrs.exhibition_id) {
      const exhibitions = await companyExhibitionFactory.create(1, {
        company_id: attrs.company_id
      });
      attrs.exhibition_id = exhibitions[0].exhibition_id;
    }
    
    // Create car brand if carbrand_id not provided
    if (!attrs.carbrand_id) {
      const brands = await carBrandFactory.create(1);
      attrs.carbrand_id = brands[0].brand_id;
    }
    
    for (let i = 0; i < count; i++) {
      let carData = this.makeOne(attrs);
      
      // Handle array attributes for model
      if (Array.isArray(attrs.model) && i < attrs.model.length) {
        carData.model = attrs.model[i];
      }
      
      // Handle array attributes for company_id
      if (Array.isArray(attrs.company_id) && i < attrs.company_id.length) {
        carData.company_id = attrs.company_id[i];
      }
      
      // Handle array attributes for exhibition_id
      if (Array.isArray(attrs.exhibition_id) && i < attrs.exhibition_id.length) {
        carData.exhibition_id = attrs.exhibition_id[i];
      }
      
      // Handle array attributes for carbrand_id
      if (Array.isArray(attrs.carbrand_id) && i < attrs.carbrand_id.length) {
        carData.carbrand_id = attrs.carbrand_id[i];
      }
      
      cars.push(await Car.create(carData));
    }
    
    return cars;
  },
  
  makeOne(attrs = {}) {
    // Generate a random year between 2015 and current year
    const currentYear = new Date().getFullYear();
    
    const defaultAttrs = {
      company_id: attrs.company_id || 1,
      exhibition_id: attrs.exhibition_id || 1,
      carbrand_id: attrs.carbrand_id || 1,
      model: attrs.model || faker.vehicle.model(),
      year: attrs.year || faker.number.int({ min: 2015, max: currentYear }),
      price_per_day: attrs.price_per_day || parseFloat(faker.commerce.price({ min: 50, max: 300 }))
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
