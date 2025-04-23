const CarBrandModel = require('../../models/CarBrand');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class CarBrandRepository extends BaseRepository {
    constructor() {
        super(CarBrandModel);
    }

    async findAllBrands(options = {}) {
        try {
            return await this.model.findAll({
                ...options,
                order: [['name', 'ASC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByName(name) {
        try {
            return await this.model.findOne({
                where: { 
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findBrandWithCars(brandId) {
        try {
            return await this.model.findByPk(brandId, {
                include: [{
                    association: 'cars',
                    include: ['images', 'company']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findBrands(search = null) {
        try {
            const whereClause = {};
            if (search) {
                whereClause.name = { [Op.like]: `%${search}%` };
            }
            
            return await this.findFiltered(
                whereClause, 
                [['name', 'ASC']]
            );
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CarBrandRepository();
