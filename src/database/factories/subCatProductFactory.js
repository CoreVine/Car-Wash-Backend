const SubCatProduct = require('../../models/SubCatProduct');
const subCategoryFactory = require('./subCategoryFactory');
const productsFactory = require('./productsFactory');

const subCatProductFactory = {
  async create(count = 1, attrs = {}) {
    const subCatProducts = [];
    
    // Create subcategory if not provided
    if (!attrs.sub_category_id) {
      const subCategories = await subCategoryFactory.create(1);
      attrs.sub_category_id = subCategories[0].sub_category_id;
    }
    
    // Create product if not provided
    if (!attrs.product_id) {
      const products = await productsFactory.create(1);
      attrs.product_id = products[0].product_id;
    }
    
    for (let i = 0; i < count; i++) {
      const subCatProductData = this.makeOne(attrs);
      subCatProducts.push(await SubCatProduct.create(subCatProductData));
    }
    
    return subCatProducts;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {};
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const subCatProducts = [];
    
    for (let i = 0; i < count; i++) {
      subCatProducts.push(this.makeOne(attrs));
    }
    
    return subCatProducts;
  }
};

module.exports = subCatProductFactory;
