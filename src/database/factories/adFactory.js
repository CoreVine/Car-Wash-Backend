const { faker } = require('@faker-js/faker');
const Ad = require('../../models/Ad');

const adFactory = {
  async create(count = 1, attrs = {}) {
    const ads = [];
    
    // Handle the case where names are provided as an array
    let names = [];
    if (attrs.name && Array.isArray(attrs.name)) {
      names = [...attrs.name];
      delete attrs.name; // Remove name from attrs to avoid validation error
    }
    
    for (let i = 0; i < count; i++) {
      const adData = this.makeOne({
        ...attrs,
        // Use name from the names array if available, otherwise generate one
        name: names[i] || faker.commerce.productName()
      });
      
      ads.push(await Ad.create(adData));
    }
    
    return ads;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      name: faker.commerce.productName(),
      image_url: faker.image.urlLoremFlickr({ category: 'business' })
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const ads = [];
    
    for (let i = 0; i < count; i++) {
      ads.push(this.makeOne(attrs));
    }
    
    return ads;
  }
};

module.exports = adFactory;
