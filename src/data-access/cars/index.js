const { DatabaseError, Op, literal } = require("sequelize");
const CarModel = require('../../models/Car');
const BaseRepository = require('../base.repository');
const CompanyExhibitionRepository = require('../company-exhibitions');
const CarBrandRepository = require('../car-brands');
const RentalCarImageRepository = require('../rental-car-images');

class CarRepository extends BaseRepository {
    constructor() {
        super(CarModel);
    }

    async findByCompanyId(companyId, options = {}) {
        try {
            return await this.model.findAll({
                where: { company_id: companyId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByExhibitionId(exhibitionId, options = {}) {
        try {
            return await this.model.findAll({
                where: { exhibition_id: exhibitionId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findWithImages(carId) {
        try {
            return await this.model.findByPk(carId, {
                include: ['images', 'company', 'exhibition', 'brand']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCarsWithFilters({
        page = 1, 
        limit = 10, 
        company_id = null, 
        exhibition_id = null,
        carbrand_id = null,
        min_price = null,
        max_price = null,
        min_year = null,
        max_year = null,
        search = null,
        available_from = null,
        available_to = null,
        only_available = false,
        sale_or_rental = null
    }) {
        try {
            const whereClause = {};
            
            // Filter by listing type (sale or rental)
            if (sale_or_rental) {
                whereClause.sale_or_rental = sale_or_rental;
            }
            
            // Filter by company
            if (company_id) {
                whereClause.company_id = company_id;
            }
            
            // Filter by exhibition
            if (exhibition_id) {
                whereClause.exhibition_id = exhibition_id;
            }
            
            // Filter by brand
            if (carbrand_id) {
                whereClause.carbrand_id = carbrand_id;
            }
            
            // Filter by price range
            if (min_price !== null || max_price !== null) {
                whereClause.price = {};
                if (min_price !== null) {
                    whereClause.price[Op.gte] = parseFloat(min_price);
                }
                if (max_price !== null) {
                    whereClause.price[Op.lte] = parseFloat(max_price);
                }
            }
            
            // Filter by year range
            if (min_year !== null || max_year !== null) {
                whereClause.year = {};
                if (min_year !== null) {
                    whereClause.year[Op.gte] = parseInt(min_year);
                }
                if (max_year !== null) {
                    whereClause.year[Op.lte] = parseInt(max_year);
                }
            }
            
            // Search by model or description
            if (search) {
                whereClause[Op.or] = [
                    { model: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ];
            }
            
            // Build include options
            const includeOptions = [
                {
                    association: 'company',
                    attributes: ['company_id', 'company_name', 'logo_url']
                },
                {
                    association: 'exhibition'
                },
                {
                    association: 'brand'
                },
                {
                    association: 'images'
                }
            ];

            if (only_available) {
                includeOptions.push({
                    model: this.model.sequelize.model('RentalOrder'),
                    as: 'rentalOrders',
                    required: false
                });
                
                whereClause[Op.not] = {
                    car_id: {
                        [Op.in]: literal(`(
                          SELECT car_id FROM rentalorders
                        )`)
                    }
                };
            }
            
            // Advanced filtering for availability
            if (available_from && available_to) {
                includeOptions.push({
                    model: this.model.sequelize.model('RentalOrder'),
                    as: 'rentalOrders',
                    required: false,
                    where: {
                        [Op.or]: [
                            { start_date: { [Op.gt]: available_to } },
                            { end_date: { [Op.lt]: available_from } }
                        ]
                    }
                });
                
                whereClause[Op.not] = {
                    car_id: {
                        [Op.in]: literal(`(
                          SELECT car_id FROM rentalorders
                          WHERE (start_date <= '${available_to}' AND end_date >= '${available_from}')
                        )`)
                    }
                };
            }
            
            const options = {
                include: includeOptions,
                order: [['year', 'DESC']]
            };
            
            return await this.findWithPagination(whereClause, page, limit, [['year', 'DESC']], options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCarWithFullDetailsAdmin(carId) {
        try {
            return await this.model.findByPk(carId, {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url', 'location']
                    },
                    {
                        association: 'exhibition'
                    },
                    {
                        association: 'brand'
                    },
                    {
                        association: 'images'
                    },
                    {
                        association: 'rentalOrders',
                        separate: true,
                        limit: 5,
                        order: [['start_date', 'DESC']],
                        include: [{
                            association: 'order',
                            include: ['user']
                        }]
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findCarWithFullDetailsUser(carId) {
        try {
            return await this.model.findByPk(carId, {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url', 'location']
                    },
                    {
                        association: 'exhibition'
                    },
                    {
                        association: 'brand'
                    },
                    {
                        association: 'images'
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async hasActiveRentals(carId) {
        try {
            const count = await this.model.sequelize.model('RentalOrder').count({
                where: {
                    car_id: carId,
                    end_date: { [Op.gt]: new Date() }
                }
            });
            
            return count > 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async safeDeleteWithImages(carId) {
        try {
            // Check if car has active rentals
            const hasActiveRentals = await this.hasActiveRentals(carId);
            
            if (hasActiveRentals) {
                throw new Error('Cannot delete car with active rentals');
            }
            
            // Get images before deletion for file cleanup
            const images = await this.model.sequelize.models.RentalCarImage.findAll({
                where: { car_id: carId }
            });
            
            // Delete car (will cascade to images in DB)
            await this.delete(carId);
            
            // Return images for file system cleanup
            return images;
        } catch (error) {
            if (error.message === 'Cannot delete car with active rentals') {
                throw error; // Rethrow specific errors
            }
            throw new DatabaseError(error);
        }
    }

    async createWithImagesAndValidation(carData, imageRecords, companyId) {
        try {
            const transaction = await this.model.sequelize.transaction();
            
            try {
                // Validate exhibition belongs to company
                const exhibition = await CompanyExhibitionRepository.findOne({
                    where: {
                        exhibition_id: parseInt(carData.exhibition_id),
                        company_id: companyId
                    }
                });
                
                if (!exhibition) {
                    throw new Error('Exhibition not found or does not belong to your company');
                }
                
                // Validate brand exists
                const brand = await CarBrandRepository.findById(carData.carbrand_id, { transaction });
                
                if (!brand) {
                    throw new Error('Car brand not found');
                }
                
                // Create the car
                const car = await this.create({
                    ...carData,
                    company_id: companyId
                }, { transaction });
                
                // Create images if any
                let images = [];
                if (imageRecords && imageRecords.length > 0) {
                    const imageData = imageRecords.map(image => ({
                        ...image,
                        car_id: car.car_id
                    }));
                    
                    images = await RentalCarImageRepository.bulkCreate(imageData, { transaction });
                }
                
                // Commit transaction
                await transaction.commit();
                
                // Return car with images
                const result = { ...car.toJSON(), images };
                return result;
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CarRepository();
