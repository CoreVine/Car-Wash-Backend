import RentalCarImageModel from '../../models/RentalCarImage';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

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
}

module.exports = new RentalCarImageRepository();
