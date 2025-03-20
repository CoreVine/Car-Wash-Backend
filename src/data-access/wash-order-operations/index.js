const WashOrderOperationModel = require('../../models/WashOrderOperation');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class WashOrderOperationRepository extends BaseRepository {
    constructor() {
        super(WashOrderOperationModel);
    }

    async findByWashOrderId(washOrderId) {
        try {
            return await this.model.findOne({
                where: { wash_order_id: washOrderId },
                include: ['assignedEmployee']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findByEmployeeId(employeeId, options = {}) {
        try {
            return await this.model.findAll({
                where: { employee_assigned_id: employeeId },
                include: ['washOrder'],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findPendingByCompany(companyId) {
        try {
            return await this.model.findAll({
                where: {
                    company_id: companyId,
                    operation_done_at: null
                },
                include: [{
                    association: 'washOrder',
                    include: ['customerCar']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common queries
    async findEmployeeOperationsPaginated(employeeId, page = 1, limit = 10) {
        try {
            const options = {
                where: { employee_assigned_id: employeeId },
                include: ['washOrder'],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findPendingOperationsByCompanyPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: {
                    company_id: companyId,
                    operation_done_at: null
                },
                include: [{
                    association: 'washOrder',
                    include: ['customerCar']
                }],
                order: [['created_at', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new WashOrderOperationRepository();
