const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const userFactory = {
  /**
   * Create one or more user records
   * @param {number} count - Number of users to create
   * @param {Object} attrs - Override default attributes
   * @returns {Promise<Array>} Array of created user instances
   */
  async create(count = 1, attrs = {}) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      const userData = this.makeOne(attrs);
      users.push(await User.create(userData));
    }
    
    return users;
  },
  
  /**
   * Generate user data without saving to database
   * @param {Object} attrs - Override default attributes
   * @returns {Object} User data object
   */
  makeOne(attrs = {}) {
    const defaultAttrs = {
      acc_type: faker.helpers.arrayElement(['user', 'employee']),
      profile_picture_url: faker.image.avatar(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password_hash: bcrypt.hashSync('password123', 8),
      phone_number: faker.phone.number(),
      address: faker.location.streetAddress(true),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  /**
   * Generate multiple user data objects without saving
   * @param {number} count - Number of users to generate
   * @param {Object} attrs - Override default attributes
   * @returns {Array<Object>} Array of user data objects
   */
  make(count = 1, attrs = {}) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      users.push(this.makeOne(attrs));
    }
    
    return users;
  }
};

module.exports = userFactory;
