const config = require('../config/database');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config);

// Import all models
const Ad = require('../models/Ad');
const Car = require('../models/Car');
const Cart = require('../models/Cart');
const CarBrand = require('../models/CarBrand');
const CarWashOrder = require('../models/CarWashOrder');
const Category = require('../models/Category');
const Company = require('../models/Company');
const CompanyDocument = require('../models/CompanyDocument');
const CompanyExhibition = require('../models/CompanyExhibition');
const CustomerCar = require('../models/CustomerCar');
const Employee = require('../models/Employee');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatusHistory = require('../models/OrderStatusHistory');
const PaymentMethod = require('../models/PaymentMethod');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Rating = require('../models/Rating');
const RentalCarImage = require('../models/RentalCarImage');
const RentalOrder = require('../models/RentalOrder');
const SubCategory = require('../models/SubCategory');
const SubCatProduct = require('../models/SubCatProduct');
const User = require('../models/User');
const WashOrderOperation = require('../models/WashOrderOperation');
const WashOrderWashType = require('../models/WashOrderWashType');
const WashType = require('../models/WashType');
const CarOrders = require('../models/CarOrder');

/**
 * Initialize database and models before seeding
 */
async function initBeforeSeeding() {
  try {
    // Initialize all models
    const models = {
      Ad: Ad.init(sequelize),
      Car: Car.init(sequelize),
      Cart: Cart.init(sequelize),
      CarBrand: CarBrand.init(sequelize),
      CarWashOrder: CarWashOrder.init(sequelize),
      Category: Category.init(sequelize),
      Company: Company.init(sequelize),
      CompanyDocument: CompanyDocument.init(sequelize),
      CompanyExhibition: CompanyExhibition.init(sequelize),
      CustomerCar: CustomerCar.init(sequelize),
      Employee: Employee.init(sequelize),
      Order: Order.init(sequelize),
      OrderItem: OrderItem.init(sequelize),
      OrderStatusHistory: OrderStatusHistory.init(sequelize),
      PaymentMethod: PaymentMethod.init(sequelize),
      Product: Product.init(sequelize),
      ProductImage: ProductImage.init(sequelize),
      Rating: Rating.init(sequelize),
      RentalCarImage: RentalCarImage.init(sequelize),
      RentalOrder: RentalOrder.init(sequelize),
      SubCategory: SubCategory.init(sequelize),
      SubCatProduct: SubCatProduct.init(sequelize),
      User: User.init(sequelize),
      WashOrderOperation: WashOrderOperation.init(sequelize),
      WashOrderWashType: WashOrderWashType.init(sequelize),
      WashType: WashType.init(sequelize),
      CarOrders: CarOrders.init(sequelize)
    };
    
    // Call associate methods on all models that have them
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });
    
    console.log('Database and models initialized for seeding');
    
    return { sequelize, models };
  } catch (error) {
    console.error('Error initializing database for seeding:', error);
    throw error;
  }
}

module.exports = {
  initBeforeSeeding,
  sequelize
};
