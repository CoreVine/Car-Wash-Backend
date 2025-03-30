const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const Company = require('../../models/Company');

const companyFactory = {
  async create(count = 1, attrs = {}) {
    const companies = [];
    
    for (let i = 0; i < count; i++) {
      const companyData = this.makeOne(attrs);
      companies.push(await Company.create(companyData));
    }
    
    return companies;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      company_name: faker.company.name(),
      email: faker.internet.email(),
      phone_number: faker.phone.number(),
      location: faker.location.streetAddress(true),
      logo_url: faker.image.urlLoremFlickr({ category: 'business' }),
      password_hash: bcrypt.hashSync('company123', 8),
      about: faker.company.catchPhrase() + '. ' + faker.company.buzzPhrase(),
      approved: faker.helpers.arrayElement([0, 1]),
      total_rating: faker.number.int({ min: 0, max: 5 }),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const companies = [];
    
    for (let i = 0; i < count; i++) {
      companies.push(this.makeOne(attrs));
    }
    
    return companies;
  }
};

module.exports = companyFactory;
