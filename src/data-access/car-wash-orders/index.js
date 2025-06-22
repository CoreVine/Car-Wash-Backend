const CarWashOrderModel = require("../../models/CarWashOrder");
const BaseRepository = require("../base.repository");
const { DatabaseError, Op } = require("sequelize");

class CarWashOrderRepository extends BaseRepository {
  constructor() {
    super(CarWashOrderModel);
  }

  async findByCustomerId(customerId, options = {}) {
    try {
      return await this.model.findAll({
        where: { customer_id: customerId },
        ...options,
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findByOrderId(orderId) {
    try {
      return await this.model.findOne({
        where: { order_id: orderId },
        include: ["operation", "customer"],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // New methods for common operations
  async findCustomerWashOrdersPaginated(customerId, page = 1, limit = 10) {
    try {
      const options = {
        where: { customer_id: customerId },
        include: [
          {
            association: "operation",
            include: ["assignedEmployee"],
          },
          {
            association: "order",
            include: ["statusHistory"],
          },
        ],
        order: [["created_at", "DESC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCarWashOrderWithDetails(washOrderId) {
    try {
      return await this.model.findByPk(washOrderId, {
        include: [
          {
            association: "operation",
            include: [
              {
                association: "assignedEmployee",
                include: ["user"],
              },
            ],
          },
          {
            association: "order",
            include: [
              "statusHistory",
              "paymentMethod",
              {
                association: "user",
                attributes: ["user_id", "name", "email", "phone_number"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // Find wash order with wash types
  async findWithWashTypes(washOrderId) {
    try {
      return await this.model.findByPk(washOrderId, {
        include: [
          {
            association: "washTypes",
            through: {
              attributes: ["paid_price"],
            },
          },
          {
            association: "operation",
            include: ["assignedEmployee"],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // Create wash order with wash types
  async createWithWashTypes(washOrderData, washTypeData) {
    try {
      // Start transaction
      const t = await this.model.sequelize.transaction();

      try {
        // Create wash order
        const washOrder = await this.create(washOrderData, { transaction: t });

        // Create wash type associations
        if (washTypeData && washTypeData.length > 0) {
          const washOrderWashTypeRepo =
            this.model.sequelize.models.WashOrderWashType;

          const washTypeAssociations = washTypeData.map((type) => ({
            carwashorders_order_id: washOrder.wash_order_id,
            WashTypes_type_id: type.typeId,
            paid_price: type.price,
          }));

          await washOrderWashTypeRepo.bulkCreate(washTypeAssociations, {
            transaction: t,
          });
        }

        // Commit transaction
        await t.commit();

        // Return wash order with types
        return await this.findWithWashTypes(washOrder.wash_order_id);
      } catch (error) {
        console.log(error);

        // Rollback transaction on error
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // Get pending wash orders for a company
  async getPendingWashOrdersForCompany(companyId, page = 1, limit = 10) {
    try {
      const options = {
        include: [
          {
            association: "washTypes",
            through: { attributes: ["paid_price"] },
            include: [
              {
                association: "company",
                where: { company_id: companyId },
              },
            ],
          },
          {
            association: "order",
            where: {
              status: "pending",
            },
          },
        ],
        order: [["created_at", "ASC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
  async getWashOrdersForCompany(companyId, page = 1, limit = 10) {
    try {
      const options = {
        include: [
          {
            include: [
              {
                where: { company_id: companyId },
              },
            ],
          },
        ],
        // order: [["created_at", "ASC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // Add wash service to cart with types in a single transaction
  async addWashServiceToCart(cartId, washOrderData, washTypeIds) {
    try {
      // Start transaction
      const t = await this.model.sequelize.transaction();

      try {
        // Create wash order
        const washOrderDataWithOrder = {
          order_id: cartId,
          ...washOrderData,
        };

        const washOrder = await this.create(washOrderDataWithOrder, {
          transaction: t,
        });

        // Get wash types with prices
        const WashType = this.model.sequelize.model("WashType");
        const washTypes = await WashType.findAll({
          where: {
            type_id: { [Op.in]: washTypeIds },
          },
          transaction: t,
        });

        if (!washTypes || washTypes.length !== washTypeIds.length) {
          throw new Error("One or more wash types not found");
        }

        // Create wash type associations
        const WashOrderWashType =
          this.model.sequelize.model("WashOrderWashType");

        const washTypeAssociations = washTypes.map((type) => ({
          order_id: washOrder.wash_order_id,
          type_id: type.type_id,
          paid_price: type.price,
        }));

        await WashOrderWashType.bulkCreate(washTypeAssociations, {
          transaction: t,
        });

        // Commit transaction
        await t.commit();

        // Return wash order with types
        return await this.findWithWashTypes(washOrder.wash_order_id);
      } catch (error) {
        console.log(error.message);

        // Rollback transaction on error
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  // Remove wash type from wash order in a transaction
  async removeWashType(washOrderId, washTypeId) {
    try {
      const t = await this.model.sequelize.transaction();

      try {
        const WashOrderWashType =
          this.model.sequelize.model("WashOrderWashType");

        // Remove the wash type association
        await WashOrderWashType.destroy({
          where: {
            carwashorders_order_id: washOrderId,
            WashTypes_type_id: washTypeId,
          },
          transaction: t,
        });

        // Check if there are any wash types left
        const remainingWashTypes = await WashOrderWashType.findAll({
          where: {
            carwashorders_order_id: washOrderId,
          },
          transaction: t,
        });

        // If no wash types remain, remove the wash order
        if (remainingWashTypes.length === 0) {
          await this.delete(washOrderId, { transaction: t });
        }

        await t.commit();

        return remainingWashTypes.length > 0;
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = new CarWashOrderRepository();
