import CarModel from '../../models/Car';
import BaseRepository from '../base.repository';
import {DatabaseError, Op, literal} from "sequelize";

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
                include: ['images', 'company', 'exhibition']
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
        min_price = null,
        max_price = null,
        min_year = null,
        max_year = null,
        search = null,
        available_from = null,
        available_to = null
    }) {
        try {
            const whereClause = {};
            
            // Filter by company
            if (company_id) {
                whereClause.company_id = company_id;
            }
            
            // Filter by exhibition
            if (exhibition_id) {
                whereClause.exhibition_id = exhibition_id;
            }
            
            // Filter by price range
            if (min_price !== null || max_price !== null) {
                whereClause.price_per_day = {};
                if (min_price !== null) {
                    whereClause.price_per_day[Op.gte] = parseFloat(min_price);
                }
                if (max_price !== null) {
                    whereClause.price_per_day[Op.lte] = parseFloat(max_price);
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
            
            // Search by model
            if (search) {
                whereClause.model = { [Op.like]: `%${search}%` };
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
                    association: 'images'
                }
            ];
            
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
                        [Op.in]: literal(`
                          SELECT car_id FROM RentalOrders
                          WHERE (start_date <= '${available_to}' AND end_date >= '${available_from}')
                        `)
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
    
    async findCarWithFullDetails(carId) {
        try {
            return await this.model.findByPk(carId, {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url', 'location']
                    },
                    {
                        association: 'exhibition',
                        include: ['company']
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
}

module.exports = new CarRepository();
