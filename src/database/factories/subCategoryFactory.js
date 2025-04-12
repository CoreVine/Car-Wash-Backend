const { faker } = require('@faker-js/faker');
const SubCategory = require('../../models/SubCategory');
const categoryFactory = require('./categoryFactory');

const subCategoryFactory = {
  async create(count = 1, attrs = {}) {
    const subCategories = [];
    
    // Create category if category_id not provided
    if (!attrs.category_id) {
      const categories = await categoryFactory.create(1);
      attrs.category_id = categories[0].category_id;
    }
    
    for (let i = 0; i < count; i++) {
      const subCategoryData = this.makeOne(attrs);
      subCategories.push(await SubCategory.create(subCategoryData));
    }
    
    return subCategories;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      name: faker.commerce.productAdjective() + ' ' + faker.commerce.product(),
      icon: faker.helpers.arrayElement(['fa-car-wash', 'fa-spray-can', 'fa-tire', 'fa-oil-can', 'fa-gas-pump'])
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const subCategories = [];
    
    for (let i = 0; i < count; i++) {
      subCategories.push(this.makeOne(attrs));
    }
    
    return subCategories;
  }
};

module.exports = subCategoryFactory;
