const { faker } = require('@faker-js/faker');
const Cart = require('../../models/Cart');
const userFactory = require('./userFactory');

const cartFactory = {
  async create(count = 1, attrs = {}) {
    const carts = [];
    
    // Create user if not provided
    if (!attrs.user_id) {
      const users = await userFactory.create(1);
      attrs.user_id = users[0].user_id;
    }
    
    for (let i = 0; i < count; i++) {
      const cartData = this.makeOne(attrs);
      carts.push(await Cart.create(cartData));
    }
    
    return carts;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      status: attrs.status || faker.helpers.arrayElement(['cart', 'pending', 'complete']),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const carts = [];
    
    for (let i = 0; i < count; i++) {
      carts.push(this.makeOne(attrs));
    }
    
    return carts;
  }
};

module.exports = cartFactory;
