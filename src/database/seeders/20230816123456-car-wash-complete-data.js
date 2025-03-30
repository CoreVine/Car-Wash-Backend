const { initBeforeSeeding } = require('../seedHelper');
const factories = require('../factories');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Starting database seeding...');
    
    // Initialize database and models before seeding
    await initBeforeSeeding();
    
    try {
      // 1. Create payment methods (no dependencies)
      console.log('Creating payment methods...');
      const paymentMethods = await factories.paymentMethodFactory.create(3, {
        name: ['Credit Card', 'PayPal', 'Cash on Delivery']
      });
      
      // 2. Create categories (no dependencies)
      console.log('Creating product categories...');
      const categories = await factories.categoryFactory.create(4);
      
      // 3. Create subcategories (depends on categories)
      console.log('Creating product subcategories...');
      const subCategories = [];
      for (const category of categories) {
        const subs = await factories.subCategoryFactory.create(3, { 
          category_id: category.category_id 
        });
        subCategories.push(...subs);
      }
      
      // 4. Create users (no dependencies)
      console.log('Creating regular users...');
      const users = await factories.userFactory.create(15, { acc_type: 'user' });
      
      // 5. Create customer cars (depends on users)
      console.log('Creating customer cars...');
      const customerCars = [];
      for (const user of users) {
        // Each user has 1-3 cars
        const carCount = Math.floor(Math.random() * 3) + 1;
        const cars = await factories.customerCarFactory.create(carCount, { 
          customer_id: user.user_id 
        });
        customerCars.push(...cars);
      }
      
      // 6. Create companies (no dependencies)
      console.log('Creating companies...');
      const companies = await factories.companyFactory.create(5, { approved: 1 });
      
      // Add wash types for each company after creating companies
      console.log('Creating wash types for companies...');
      const washTypes = [];
      const washTypeNames = [
        'Basic Wash',
        'Premium Wash',
        'Deluxe Wash',
        'Interior Cleaning',
        'Exterior Polish',
        'Full Service'
      ];

      for (const company of companies) {
        // Each company has 3-5 wash types
        const washTypeCount = Math.floor(Math.random() * 3) + 3;
        
        // Create wash types one by one instead of using the name array
        for (let i = 0; i < washTypeCount; i++) {
          const nameIndex = i % washTypeNames.length;
          const companyWashType = await factories.washTypeFactory.create(1, {
            company_id: company.company_id,
            name: washTypeNames[nameIndex]
          });
          washTypes.push(companyWashType[0]);
        }
      }
      
      // 7. Create company documents (depends on companies)
      console.log('Creating company documents...');
      for (const company of companies) {
        await factories.companyDocumentsFactory.create(3, { 
          company_id: company.company_id 
        });
      }
      
      // 8. Create employee users (no dependencies yet)
      console.log('Creating employee users...');
      const employeeUsers = await factories.userFactory.create(20, { acc_type: 'employee' });
      
      // 9. Create employees (depends on employee users and companies)
      console.log('Creating employees...');
      const employees = [];
      let userIndex = 0;
      
      for (const company of companies) {
        // Create 1 super-admin, 1 manager, and 2 regular employees per company
        await factories.employeeFactory.create(1, {
          user_id: employeeUsers[userIndex++].user_id,
          company_id: company.company_id,
          role: 'super-admin'
        });
        
        await factories.employeeFactory.create(1, {
          user_id: employeeUsers[userIndex++].user_id,
          company_id: company.company_id,
          role: 'manager'
        });
        
        const regularEmployees = await factories.employeeFactory.create(2, {
          user_id: [employeeUsers[userIndex++].user_id, employeeUsers[userIndex++].user_id],
          company_id: company.company_id,
          role: 'employee'
        });
        employees.push(...regularEmployees);
      }
      
      // 10. Create products (depends on companies)
      console.log('Creating products...');
      const products = [];
      for (const company of companies) {
        // Each company has 5-10 products
        const productCount = Math.floor(Math.random() * 6) + 5;
        const companyProducts = await factories.productsFactory.create(productCount, {
          company_id: company.company_id
        });
        products.push(...companyProducts);
        
        // 11. Create product images (depends on products)
        console.log(`Creating product images for company ${company.company_name}...`);
        for (const product of companyProducts) {
          await factories.productsImagesFactory.create(3, {
            product_id: product.product_id
          });
        }
      }
      
      // 12. Associate products with subcategories
      console.log('Associating products with subcategories...');
      for (const product of products) {
        // Each product belongs to 1-2 subcategories
        const subCatCount = Math.floor(Math.random() * 2) + 1;
        const randomSubCats = subCategories
          .sort(() => 0.5 - Math.random())
          .slice(0, subCatCount);
          
        for (const subCat of randomSubCats) {
          await factories.subCatProductFactory.create(1, {
            product_id: product.product_id,
            sub_category_id: subCat.sub_category_id
          });
        }
      }
      
      // 13. Create company exhibitions (depends on companies)
      console.log('Creating company exhibitions...');
      const exhibitions = [];
      for (const company of companies) {
        // Each company has 1-3 exhibition locations
        const exhibitionCount = Math.floor(Math.random() * 3) + 1;
        const companyExhibitions = await factories.companyExhibitionFactory.create(exhibitionCount, {
          company_id: company.company_id
        });
        exhibitions.push(...companyExhibitions);
      }
      
      // 14. Create rental cars (depends on companies and exhibitions)
      console.log('Creating rental cars...');
      const cars = [];
      for (const exhibition of exhibitions) {
        // Each exhibition has 3-7 cars
        const carCount = Math.floor(Math.random() * 5) + 3;
        const exhibitionCars = await factories.carsFactory.create(carCount, {
          company_id: exhibition.company_id,
          exhibition_id: exhibition.exhibition_id
        });
        cars.push(...exhibitionCars);
        
        // 15. Create car images (depends on cars)
        for (const car of exhibitionCars) {
          await factories.rentalCarsImagesFactory.create(4, {
            car_id: car.car_id
          });
        }
      }
      
      // 16. Create product orders and items
      console.log('Creating product orders and items...');
      for (let i = 0; i < 25; i++) {
        // Get random user and company
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Create order for products
        const order = await factories.ordersFactory.create(1, {
          user_id: randomUser.user_id,
          company_id: randomCompany.company_id,
          payment_method_id: randomPayment.payment_id,
          order_type: 'product'
        });
        
        // Get company's products
        const companyProducts = products.filter(p => p.company_id === randomCompany.company_id);
        
        // Add 1-5 items to the order
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const orderProducts = companyProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, itemCount);
          
        for (const product of orderProducts) {
          await factories.orderItemsFactory.create(1, {
            order_id: order[0].order_id,
            product_id: product.product_id
          });
        }
        
        // Create order status history
        await factories.orderStatusHistoryFactory.create(2, {
          order_id: order[0].order_id,
          status: ['pending', 'complete']
        });
      }
      
      // 17. Create car wash orders
      console.log('Creating car wash orders...');
      for (let i = 0; i < 15; i++) {
        // Get random user and company
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Get one of user's cars
        const userCars = customerCars.filter(c => c.customer_id === randomUser.user_id);
        if (userCars.length === 0) continue;
        const randomCar = userCars[Math.floor(Math.random() * userCars.length)];
        
        // Create order for car wash
        const order = await factories.ordersFactory.create(1, {
          user_id: randomUser.user_id,
          company_id: randomCompany.company_id,
          payment_method_id: randomPayment.payment_id,
          order_type: 'wash'
        });
        
        // Create wash order
        const washOrder = await factories.carWashOrdersFactory.create(1, {
          order_id: order[0].order_id,
          customer_id: randomUser.user_id,
          customer_car_id: randomCar.customer_car_id
        });
        
        // Get wash types for the company
        const companyWashTypes = washTypes.filter(wt => wt.company_id === randomCompany.company_id);
        
        // Add 1-3 wash types to the order
        if (companyWashTypes.length > 0) {
          const typeCount = Math.min(Math.floor(Math.random() * 3) + 1, companyWashTypes.length);
          const selectedTypes = companyWashTypes
            .sort(() => 0.5 - Math.random())
            .slice(0, typeCount);
            
          for (const washType of selectedTypes) {
            await factories.washOrderWashTypeFactory.create(1, {
              carwashorders_order_id: washOrder[0].wash_order_id,
              WashTypes_type_id: washType.type_id,
              paid_price: washType.price
            });
          }
        }
        
        // Assign employee to wash order
        const companyEmployees = employees.filter(e => e.company_id === randomCompany.company_id);
        if (companyEmployees.length > 0) {
          const randomEmployee = companyEmployees[Math.floor(Math.random() * companyEmployees.length)];
          await factories.washOrderOperationFactory.create(1, {
            wash_order_id: washOrder[0].wash_order_id,
            employee_assigned_id: randomEmployee.user_id,
            company_id: randomCompany.company_id
          });
        }
        
        // Create order status history
        await factories.orderStatusHistoryFactory.create(2, {
          order_id: order[0].order_id,
          status: ['pending', 'complete']
        });
      }
      
      // 18. Create car rental orders
      console.log('Creating car rental orders...');
      for (let i = 0; i < 10; i++) {
        // Get random user and company
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Get random car
        const randomCar = cars[Math.floor(Math.random() * cars.length)];
        const carCompanyId = randomCar.company_id;
        
        // Create order for car rental
        const order = await factories.ordersFactory.create(1, {
          user_id: randomUser.user_id,
          company_id: carCompanyId,
          payment_method_id: randomPayment.payment_id,
          order_type: 'rental'
        });
        
        // Create rental order
        await factories.rentalOrdersFactory.create(1, {
          order_id: order[0].order_id,
          car_id: randomCar.car_id
        });
        
        // Create order status history
        await factories.orderStatusHistoryFactory.create(2, {
          order_id: order[0].order_id,
          status: ['pending', 'complete']
        });
      }
      
      // 19. Create ratings
      console.log('Creating company ratings...');
      for (let i = 0; i < 30; i++) {
        // Get random user and company
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        
        try {
          await factories.ratingsFactory.create(1, {
            user_id: randomUser.user_id,
            company_id: randomCompany.company_id
          });
        } catch (error) {
          // Skip if this user already rated this company (composite primary key constraint)
          continue;
        }
      }
      
      // 20. Create ads
      console.log('Creating ads...');
      await factories.adFactory.create(5, {
        name: [
          'Summer Car Wash Discount',
          'Premium Car Maintenance',
          'New Car Rental Arrivals',
          'Special Weekend Offers',
          'Holiday Season Deals'
        ]
      });
      
      console.log('Database seeding completed successfully! 🚀');
      
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove data in reverse order of dependencies
      console.log('Removing ads...');
      await queryInterface.bulkDelete('Ads', null, {});
      
      console.log('Removing washorders_washtypes data...');
      await queryInterface.bulkDelete('washorders_washtypes', null, {});
      
      console.log('Removing WashTypes data...');
      await queryInterface.bulkDelete('WashTypes', null, {});
      
      console.log('Removing WashOrderOperation...');
      await queryInterface.bulkDelete('WashOrderOperation', null, {});
      
      console.log('Removing OrderStatusHistory...');
      await queryInterface.bulkDelete('OrderStatusHistory', null, {});
      
      console.log('Removing RentalOrders...');
      await queryInterface.bulkDelete('RentalOrders', null, {});
      
      console.log('Removing CarWashOrders...');
      await queryInterface.bulkDelete('CarWashOrders', null, {});
      
      console.log('Removing OrderItems...');
      await queryInterface.bulkDelete('OrderItems', null, {});
      
      console.log('Removing Orders...');
      await queryInterface.bulkDelete('Orders', null, {});
      
      console.log('Removing RentalCarsImages...');
      await queryInterface.bulkDelete('RentalCarsImages', null, {});
      
      console.log('Removing Cars...');
      await queryInterface.bulkDelete('Cars', null, {});
      
      console.log('Removing CompanyExhibition...');
      await queryInterface.bulkDelete('CompanyExhibition', null, {});
      
      console.log('Removing ProductsImages...');
      await queryInterface.bulkDelete('ProductsImages', null, {});
      
      console.log('Removing SubCatProduct...');
      await queryInterface.bulkDelete('SubCatProduct', null, {});
      
      console.log('Removing Products...');
      await queryInterface.bulkDelete('Products', null, {});
      
      console.log('Removing SubCategory...');
      await queryInterface.bulkDelete('SubCategory', null, {});
      
      console.log('Removing Category...');
      await queryInterface.bulkDelete('Category', null, {});
      
      console.log('Removing CustomerCar...');
      await queryInterface.bulkDelete('CustomerCar', null, {});
      
      console.log('Removing CompanyDocuments...');
      await queryInterface.bulkDelete('CompanyDocuments', null, {});
      
      console.log('Removing Ratings...');
      await queryInterface.bulkDelete('Ratings', null, {});
      
      console.log('Removing Employee...');
      await queryInterface.bulkDelete('Employee', null, {});
      
      console.log('Removing Company...');
      await queryInterface.bulkDelete('Company', null, {});
      
      console.log('Removing Users...');
      await queryInterface.bulkDelete('Users', null, {});
      
      console.log('Removing PaymentMethod...');
      await queryInterface.bulkDelete('PaymentMethod', null, {});
      
      console.log('All seeded data has been removed.');
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }
};
