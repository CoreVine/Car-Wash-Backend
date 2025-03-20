const UserModel = require('../../models/User');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class UserRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }

    async findOneByEmailOrUsername({ email, username }){
        try {
            return await this.model.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { username }
                    ]
                }
            })
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findOneByEmail(email){
        try {
            return await this.model.findOne({
                where: { email }
            })
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByIdExcludeProps(id, excludeProps = []){
        try {
            return await this.model.findByPk(id, {
                attributes: {
                    exclude: excludeProps
                }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for pagination and common queries
    async findAllPaginatedUsers(page = 1, limit = 10) {
        try {
            return await this.findAllPaginated(page, limit, {
                attributes: { exclude: ['password_hash'] },
                order: [['created_at', 'DESC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new UserRepository();
