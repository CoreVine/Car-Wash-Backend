const { faker } = require('@faker-js/faker');
const Ratings = require('../../models/Rating');
const userFactory = require('./userFactory');
const companyFactory = require('./companyFactory');

const ratingsFactory = {
  async create(count = 1, attrs = {}) {
    const ratings = [];
    
    // Create user if not provided
    if (!attrs.user_id) {
      const users = await userFactory.create(1);
      attrs.user_id = users[0].user_id;
    }
    
    // Create company if not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    for (let i = 0; i < count; i++) {
      const ratingData = this.makeOne(attrs);
      ratings.push(await Ratings.create(ratingData));
    }
    
    return ratings;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      rating_value: parseFloat(faker.number.float({ min: 1, max: 5, precision: 0.5 })).toFixed(1),
      review_text: faker.lorem.paragraph(),
      created_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const ratings = [];
    
    for (let i = 0; i < count; i++) {
      ratings.push(this.makeOne(attrs));
    }
    
    return ratings;
  }
};

module.exports = ratingsFactory;
