// Export all factories to make them easier to import
const carBrandFactory = require('./carBrandFactory');

module.exports = {
  userFactory: require('./userFactory'),
  companyFactory: require('./companyFactory'),
  employeeFactory: require('./employeeFactory'),
  categoryFactory: require('./categoryFactory'),
  subCategoryFactory: require('./subCategoryFactory'),
  productsFactory: require('./productsFactory'),
  productsImagesFactory: require('./productsImagesFactory'),
  subCatProductFactory: require('./subCatProductFactory'),
  companyDocumentsFactory: require('./companyDocumentsFactory'),
  paymentMethodFactory: require('./paymentMethodFactory'),
  customerCarFactory: require('./customerCarFactory'),
  companyExhibitionFactory: require('./companyExhibitionFactory'),
  carsFactory: require('./carsFactory'),
  rentalCarsImagesFactory: require('./rentalCarsImagesFactory'),
  cartFactory: require('./cartFactory'), // Updated from ordersFactory
  orderFactory: require('./orderFactory'), // New factory
  orderItemsFactory: require('./orderItemsFactory'),
  carWashOrdersFactory: require('./carWashOrdersFactory'),
  washOrderOperationFactory: require('./washOrderOperationFactory'),
  rentalOrdersFactory: require('./rentalOrdersFactory'),
  orderStatusHistoryFactory: require('./orderStatusHistoryFactory'),
  ratingsFactory: require('./ratingsFactory'),
  adFactory: require('./adFactory'),
  washTypeFactory: require('./washTypeFactory'),
  washOrderWashTypeFactory: require('./washOrderWashTypeFactory'),
  carBrandFactory
};
