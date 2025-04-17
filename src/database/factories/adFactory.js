const { faker } = require('@faker-js/faker');
const Ad = require('../../models/Ad');

const adFactory = {
  async create(count = 1, attrs = {}) {
    try {
      const ads = [];
      
      for (let i = 0; i < count; i++) {
        let adData = this.makeOne(attrs);
        
        // Handle array attributes for name
        if (Array.isArray(attrs.name) && i < attrs.name.length) {
          adData.name = attrs.name[i];
        }
        
        // Handle array attributes for link_url
        if (Array.isArray(attrs.link_url) && i < attrs.link_url.length) {
          adData.link_url = attrs.link_url[i];
        }
        
        // Add error handling when creating ad
        try {
          const ad = await Ad.create(adData);
          ads.push(ad);
          console.log(`Created ad: ${ad.name}`);
        } catch (error) {
          console.error(`Error creating ad: ${error.message}`);
          throw error;
        }
      }
      
      return ads;
    } catch (error) {
      console.error(`Error in adFactory.create: ${error.message}`);
      throw error;
    }
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      name: attrs.name || faker.commerce.productName(),
      description: attrs.description || faker.commerce.productDescription().substring(0, 255),
      image_url: attrs.image_url || `${faker.string.uuid()}.jpg`,
      link_url: attrs.link_url || faker.internet.url(),
      active: attrs.active || 1,
      priority: attrs.priority || faker.number.int({ min: 1, max: 10 }),
      created_at: new Date(),
      updated_at: new Date()
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
