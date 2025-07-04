const { faker } = require('@faker-js/faker');
const Products = require('../../models/Product');

const productsFactory = {
  async create(count = 1, attrs = {}) {
    const products = [];
        
    for (let i = 0; i < count; i++) {
      const productData = this.makeOne(attrs);
      products.push(await Products.create(productData));
    }
    
    return products;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      product_name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
      stock: faker.number.int({ min: 1, max: 1000 }),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const products = [];
    
    for (let i = 0; i < count; i++) {
      products.push(this.makeOne(attrs));
    }
    
    return products;
  }
};

module.exports = productsFactory;
