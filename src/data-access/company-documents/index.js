import CompanyDocumentModel from '../../models/CompanyDocument';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

class CompanyDocumentRepository extends BaseRepository {
    constructor() {
        super(CompanyDocumentModel);
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
    
    // New methods for common operations
    async findCompanyDocumentsPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                order: [['upload_date', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findDocumentsByType(companyId, documentType) {
        try {
            return await this.model.findAll({
                where: { 
                    company_id: companyId,
                    document_type: documentType
                },
                order: [['upload_date', 'DESC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async deleteCompanyDocuments(companyId) {
        try {
            return await this.model.destroy({
                where: { company_id: companyId }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CompanyDocumentRepository();
