const CompanyExhibitionModel = require('../../models/CompanyExhibition');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class CompanyExhibitionRepository extends BaseRepository {
    constructor() {
        super(CompanyExhibitionModel);
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

    async findWithCars(exhibitionId) {
        try {
            return await this.model.findByPk(exhibitionId, {
                include: ['cars']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCompanyExhibitionsPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                include: [{
                    association: 'cars',
                    separate: true,
                    limit: 5
                }],
                order: [['exhibition_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findExhibitionsWithFullDetails(page = 1, limit = 10) {
        try {
            const options = {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url']
                    }
                ],
                order: [['exhibition_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findExhibitionWithAllCars(exhibitionId) {
        try {
            return await this.model.findByPk(exhibitionId, {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url', 'location']
                    },
                    {
                        association: 'cars',
                        include: ['images']
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findExhibitionsWithFilters(filters = {}) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                company_id, 
                search, 
                location 
            } = filters;
            
            const whereClause = {};
            
            // Add company_id filter if provided
            if (company_id) {
                whereClause.company_id = company_id;
            }
            
            // Add location filter if provided
            if (location) {
                whereClause.location = { [Op.like]: `%${location}%` };
            }
            
            // Add general search if provided
            if (search) {
                whereClause.location = { [Op.like]: `%${search}%` };
            }
            
            const options = {
                where: whereClause,
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url']
                    }
                ],
                order: [['exhibition_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async hasAssociatedCars(exhibitionId) {
        try {
            const exhibition = await this.model.findByPk(exhibitionId, {
                include: [{
                    association: 'cars',
                    attributes: ['car_id'],
                    limit: 1
                }]
            });
            
            return exhibition && exhibition.cars && exhibition.cars.length > 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async cascadeDeleteExhibition(exhibitionId) {
        try {
            // Find the exhibition with all cars and their images
            const exhibition = await this.model.findByPk(exhibitionId, {
                include: [{
                    association: 'cars',
                    include: ['images']
                }]
            });
            
            if (!exhibition) {
                throw new Error('Exhibition not found');
            }
            
            // Store cars for later use (to handle image cleanup)
            const affectedCars = [...exhibition.cars];
            const carIds = affectedCars.map(car => car.car_id);
            
            // Delete all cars first - must be done before deleting the exhibition
            // due to foreign key constraint
            if (carIds.length > 0) {
                await this.model.sequelize.models.Car.destroy({
                    where: {
                        car_id: {
                            [Op.in]: carIds
                        }
                    }
                });
            }
            
            // Now delete the exhibition after cars have been removed
            await this.delete(exhibitionId);
            
            // Return the affected cars for image cleanup
            return affectedCars;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    // Replacing the previous safeDeleteExhibition method
    async safeDeleteExhibition(exhibitionId) {
        try {
            return await this.cascadeDeleteExhibition(exhibitionId);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findExhibitionWithCarsAndPreviewImages(exhibitionId) {
        try {
            return await this.model.findByPk(exhibitionId, {
                include: [
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url', 'location', 'about']
                    },
                    {
                        association: 'cars',
                        include: [
                            {
                                association: 'brand',
                                attributes: ['brand_id', 'name', 'logo']
                            },
                            {
                                association: 'images',
                                limit: 1, // Just one preview image per car
                                separate: true
                            }
                        ]
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CompanyExhibitionRepository();
