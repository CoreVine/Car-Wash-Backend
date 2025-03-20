const { faker } = require('@faker-js/faker');
const CompanyExhibition = require('../../models/CompanyExhibition');
const companyFactory = require('./companyFactory');

const companyExhibitionFactory = {
  async create(count = 1, attrs = {}) {
    const exhibitions = [];
    
    // Create company if not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    for (let i = 0; i < count; i++) {
      const exhibitionData = this.makeOne(attrs);
      exhibitions.push(await CompanyExhibition.create(exhibitionData));
    }
    
    return exhibitions;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      location: faker.location.streetAddress() + ', ' + faker.location.city()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const exhibitions = [];
    
    for (let i = 0; i < count; i++) {
      exhibitions.push(this.makeOne(attrs));
    }
    
    return exhibitions;
  }
};

module.exports = companyExhibitionFactory;
