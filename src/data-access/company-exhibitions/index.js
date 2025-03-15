import CompanyExhibitionModel from '../../models/CompanyExhibition';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

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
}

module.exports = new CompanyExhibitionRepository();
