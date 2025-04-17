const { faker } = require('@faker-js/faker');
const OrderItems = require('../../models/OrderItem');
const cartFactory = require('./cartFactory');
const productsFactory = require('./productsFactory');

const orderItemsFactory = {
  async create(count = 1, attrs = {}) {
    const orderItems = [];
    
    // Create cart if not provided
    if (!attrs.order_id) {
      const carts = await cartFactory.create(1, { status: 'cart' });
      attrs.order_id = carts[0].order_id;
    }
    
    // Create product if not provided
    if (!attrs.product_id) {
      const products = await productsFactory.create(1);
      attrs.product_id = products[0].product_id;
    }
    
    for (let i = 0; i < count; i++) {
      const orderItemData = this.makeOne(attrs);
      orderItems.push(await OrderItems.create(orderItemData));
    }
    
    return orderItems;
  },
  
  makeOne(attrs = {}) {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = parseFloat(faker.commerce.price({ min: 10, max: 100 }));
    
    const defaultAttrs = {
      quantity: quantity,
      price: price
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const orderItems = [];
    
    for (let i = 0; i < count; i++) {
      orderItems.push(this.makeOne(attrs));
    }
    
    return orderItems;
  }
};

module.exports = orderItemsFactory;
