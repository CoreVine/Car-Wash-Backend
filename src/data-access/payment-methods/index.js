const PaymentMethodModel = require('../../models/PaymentMethod');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class PaymentMethodRepository extends BaseRepository {
    constructor() {
        super(PaymentMethodModel);
    }

    async findByType(paymentType, options = {}) {
        try {
            return await this.model.findAll({
                where: { payment_type: paymentType },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findActive(options = {}) {
        try {
            return await this.model.findAll({
                where: { active: true },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common queries
    async findActivePaymentMethods() {
        try {
            return await this.model.findAll({
                where: { active: true },
                order: [['payment_method_id', 'ASC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findPaymentMethodsByTypePaginated(paymentType, page = 1, limit = 10) {
        try {
            const options = {
                where: { payment_type: paymentType },
                order: [['payment_method_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new PaymentMethodRepository();
