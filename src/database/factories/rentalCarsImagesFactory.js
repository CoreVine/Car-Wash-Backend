const { faker } = require('@faker-js/faker');
const RentalCarsImages = require('../../models/RentalCarImage');
const carsFactory = require('./carsFactory');

const rentalCarsImagesFactory = {
  async create(count = 1, attrs = {}) {
    const carImages = [];
    
    // Create car if not provided
    if (!attrs.car_id) {
      const cars = await carsFactory.create(1);
      attrs.car_id = cars[0].car_id;
    }
    
    for (let i = 0; i < count; i++) {
      const imageData = this.makeOne(attrs);
      carImages.push(await RentalCarsImages.create(imageData));
    }
    
    return carImages;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      image_url: faker.image.urlLoremFlickr({ category: 'car' })
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const images = [];
    
    for (let i = 0; i < count; i++) {
      images.push(this.makeOne(attrs));
    }
    
    return images;
  }
};

module.exports = rentalCarsImagesFactory;
