const { faker } = require('@faker-js/faker');
const ProductsImages = require('../../models/ProductImage');
const productsFactory = require('./productsFactory');

const productsImagesFactory = {
  async create(count = 1, attrs = {}) {
    const productImages = [];
    
    // Create product if product_id not provided
    if (!attrs.product_id) {
      const products = await productsFactory.create(1);
      attrs.product_id = products[0].product_id;
    }
    
    for (let i = 0; i < count; i++) {
      const imageData = this.makeOne(attrs);
      productImages.push(await ProductsImages.create(imageData));
    }
    
    return productImages;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      image_url: faker.image.urlLoremFlickr({ category: 'product' })
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

module.exports = productsImagesFactory;
