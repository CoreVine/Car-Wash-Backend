const { faker } = require('@faker-js/faker');
const Category = require('../../models/Category');

const categoryFactory = {
  async create(count = 1, attrs = {}) {
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const categoryData = this.makeOne(attrs);
      categories.push(await Category.create(categoryData));
    }
    
    return categories;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      category_name: faker.commerce.department(),
      icon: faker.helpers.arrayElement(['fa-car', 'fa-tools', 'fa-cog', 'fa-shopping-cart', 'fa-wrench'])
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      categories.push(this.makeOne(attrs));
    }
    
    return categories;
  }
};

module.exports = categoryFactory;
