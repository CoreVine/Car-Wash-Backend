const { faker } = require('@faker-js/faker');
const PaymentMethod = require('../../models/PaymentMethod');

class PaymentMethodFactory {
  async create(count = 1, attrs = {}) {
    const paymentMethods = [];
    
    for (let i = 0; i < count; i++) {
      const paymentMethodData = this.makeOne(attrs);
      console.log(paymentMethodData);
      
      const created = await PaymentMethod.create(paymentMethodData);
      paymentMethods.push(created);
    }
    
    return paymentMethods;
  }
  
  makeOne(attrs = {}) {
    const paymentNames = attrs.name || ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery', 'Digital Wallet'];
    
    const defaultAttrs = {
      name: faker.helpers.arrayElement(paymentNames),
      public_key: faker.string.alphanumeric(32),
      secret_key: faker.string.alphanumeric(64)
    };
    
    return { ...defaultAttrs };
  }
  
  make(count = 1, attrs = {}) {
    const paymentMethods = [];
    
    for (let i = 0; i < count; i++) {
      paymentMethods.push(this.makeOne(attrs));
    }
    
    return paymentMethods;
  }
}

module.exports = new PaymentMethodFactory();

