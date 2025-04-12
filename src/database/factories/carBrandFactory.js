const { faker } = require('@faker-js/faker');
const CarBrand = require('../../models/CarBrand');

const carBrandFactory = {
  async create(count = 1, attrs = {}) {
    const brands = [];
    
    for (let i = 0; i < count; i++) {
      let brandData = this.makeOne(attrs);
      
      // Handle array attributes
      if (Array.isArray(attrs.name) && i < attrs.name.length) {
        brandData.name = attrs.name[i];
        
        // Generate matching logo path if not specified
        if (!Array.isArray(attrs.logo)) {
          brandData.logo = `/uploads/brands/${brandData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        }
      }
      
      // Use array logo if provided
      if (Array.isArray(attrs.logo) && i < attrs.logo.length) {
        brandData.logo = attrs.logo[i];
      }
      
      brands.push(await CarBrand.create(brandData));
    }
    
    return brands;
  },
  
  makeOne(attrs = {}) {
    // Generate a random name if not provided
    const name = typeof attrs.name === 'string' ? attrs.name : faker.vehicle.manufacturer();
    
    // Generate a logo path based on the name or use a default
    const logo = `/uploads/brands/${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    
    const defaultAttrs = {
      name,
      logo
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const brands = [];
    
    for (let i = 0; i < count; i++) {
      brands.push(this.makeOne(attrs));
    }
    
    return brands;
  }
};

module.exports = carBrandFactory;
