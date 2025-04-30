const RentalCarImageModel = require('../../models/RentalCarImage');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class RentalCarImageRepository extends BaseRepository {
    constructor() {
        super(RentalCarImageModel);
    }

    async findByCarId(carId, options = {}) {
        try {
            return await this.model.findAll({
                where: { car_id: carId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findImageWithCarDetails(imageId) {
        try {
            return await this.model.findByPk(imageId, {
                include: [{
                    association: 'car',
                    include: ['company']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async deleteAllCarImages(carId) {
        try {
            return await this.model.destroy({
                where: { car_id: carId }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async bulkCreateImagesForCar(carId, imageRecords) {
        try {
            const transaction = await this.model.sequelize.transaction();
            
            try {
                // Add car_id to each image record if not present
                const recordsWithCarId = imageRecords.map(record => ({
                    ...record,
                    car_id: carId
                }));
                
                // Bulk create all images in one DB operation
                const images = await this.bulkCreate(recordsWithCarId, { transaction });
                
                // Commit the transaction
                await transaction.commit();
                
                return images;
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new RentalCarImageRepository();
