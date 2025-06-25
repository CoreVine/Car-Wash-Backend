const CartModel = require("../../models/Cart");
const BaseRepository = require("../base.repository");
const { DatabaseError, Op } = require("sequelize"); // Make sure Op is imported

class CartRepository extends BaseRepository {
  constructor() {
    super(CartModel);
  }

  async findUserActiveCart(userId) {
    try {
      return await this.model.findOne({
        where: {
          user_id: userId,
          status: "cart",
        },

        include: ["orderItems", "carWashOrder", "rentalOrder", "carOrder"],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCartWithItems(cartId) {
    try {
      return await this.model.findByPk(cartId, {
        include: [
          {
            association: "orderItems",
            include: [
              {
                association: "product",
                include: [
                  {
                    model: this.model.sequelize.model("ProductImage"),
                    as: "images",
                    attributes: ["image_url"],
                    limit: 1,
                  },
                ],
              },
            ],
          },
          {
            association: "carWashOrder",
            include: [
              "operation",
              {
                association: "washTypes",
                through: { attributes: ["paid_price"] },
              },
            ],
          },
          {
            association: "rentalOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "carOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getUserCarts(userId, page = 1, limit = 10) {
    try {
      const options = {
        where: {
          user_id: userId,
        },
        include: ["orderItems", "carWashOrder", "rentalOrder", "carOrder"],
        order: [["created_at", "DESC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async countCartItems(cartId) {
    try {
      const cart = await this.findCartWithItems(cartId);
      return cart ? cart.orderItems.length : 0;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findUserOrders(userId, page = 1, limit = 10) {
    try {
      const options = {
        where: {
          user_id: userId,
          status: { [Op.ne]: "cart" }, // Get all non-cart status (orders)
        },
        include: [
          {
            association: "orderItems",
            include: [
              {
                association: "product",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "carWashOrder",
            include: ["operation"],
            required: false, // Make this optional - may not have a car wash order
          },
          {
            association: "rentalOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
            required: false, // Make this optional - may not have a rental order
          },
          {
            association: "carOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
            required: false, // Make this optional - may not have a car order
          },
          {
            association: "order", // Include related order for payment details
            required: false, // Make this optional
          },
        ],
        order: [["created_at", "DESC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      console.error("Error in findUserOrders:", error);
      throw new DatabaseError(error);
    }
  }

  async findUserOrdersByStatus(
    userId,
    status = "pending",
    page = 1,
    limit = 10
  ) {
    try {
      const options = {
        where: {
          user_id: userId,
          status: status, // Get all non-cart status (orders)
        },
        include: [
          {
            association: "orderItems",
            include: [
              {
                association: "product",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "carWashOrder",
            include: ["operation"],
            required: false, // Make this optional - may not have a car wash order
          },
          {
            association: "rentalOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
            required: false, // Make this optional - may not have a rental order
          },
          {
            association: "carOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
            required: false, // Make this optional - may not have a car order
          },
          {
            association: "order", // Include related order for payment details
            required: false, // Make this optional
          },
        ],
        order: [["created_at", "DESC"]],
      };

      return await this.findAllPaginated(page, limit, options);
    } catch (error) {
      console.error("Error in findUserOrders:", error);
      throw new DatabaseError(error);
    }
  }

  async findOrderDetails(cartId) {
    try {
      return await this.model.findByPk(cartId, {
        where: { status: { [Op.ne]: "cart" } }, // Only get carts that are orders
        include: [
          {
            association: "orderItems",
            include: [
              {
                association: "product",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "carWashOrder",
            include: [
              "operation",
              {
                association: "washTypes",
                through: { attributes: ["paid_price"] },
                include: [
                  {
                    association: "company",
                    attributes: ["company_id", "name"],
                  },
                ],
              },
            ],
          },
          {
            association: "rentalOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "carOrder",
            include: [
              {
                association: "car",
                include: [
                  {
                    association: "images",
                    limit: 1, // Get only one image
                  },
                ],
              },
            ],
          },
          {
            association: "order",
            include: ["statusHistory", "paymentMethod"],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async addProductToCart(userId, productId, quantity) {
    try {
      const t = await this.model.sequelize.transaction();

      try {
        // Find active cart or create one
        let cart = await this.findUserActiveCart(userId);

        if (!cart) {
          cart = await this.create(
            {
              user_id: userId,
              status: "cart",
            },
            { transaction: t }
          );
        }

        // Check product and stock
        const Product = this.model.sequelize.model("Product");
        const product = await Product.findByPk(productId, { transaction: t });

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < quantity) {
          throw new Error("Not enough stock available");
        }

        // Check for existing item
        const OrderItem = this.model.sequelize.model("OrderItem");
        const existingItems = await OrderItem.findAll({
          where: { order_id: cart.order_id },
          transaction: t,
        });

        const existingItem = existingItems.find(
          (item) => item.product_id === productId
        );

        // Update or create order item
        if (existingItem) {
          await OrderItem.update(
            {
              quantity: existingItem.quantity + quantity,
              price: product.price * (existingItem.quantity + quantity),
            },
            {
              where: { order_item_id: existingItem.order_item_id },
              transaction: t,
            }
          );
        } else {
          await OrderItem.create(
            {
              order_id: cart.order_id,
              product_id: productId,
              quantity,
              price: product.price * quantity,
            },
            { transaction: t }
          );
        }

        await t.commit();

        // Return updated cart
        return await this.findCartWithItems(cart.order_id);
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async clearCartItems(cartId) {
    try {
      const t = await this.model.sequelize.transaction();

      try {
        const cart = await this.findCartWithItems(cartId, { transaction: t });

        if (!cart) {
          throw new Error("Cart not found");
        }

        // Delete all order items
        if (cart.orderItems && cart.orderItems.length > 0) {
          const OrderItem = this.model.sequelize.model("OrderItem");
          await OrderItem.destroy({
            where: { order_id: cartId },
            transaction: t,
          });
        }

        // Delete car wash order if exists
        if (cart.carWashOrder) {
          const CarWashOrder = this.model.sequelize.model("CarWashOrder");
          await CarWashOrder.destroy({
            where: { wash_order_id: cart.carWashOrder.wash_order_id },
            transaction: t,
          });
        }

        // Delete rental order if exists
        if (cart.rentalOrder) {
          const RentalOrder = this.model.sequelize.model("RentalOrder");
          await RentalOrder.destroy({
            where: { rental_order_id: cart.rentalOrder.rental_order_id },
            transaction: t,
          });
        }

        // Delete car order if exists
        if (cart.carOrder) {
          const CarOrders = this.model.sequelize.model("CarOrders");
          await CarOrders.destroy({
            where: { orders_order_id: cartId },
            transaction: t,
          });
        }

        // Delete cart
        await this.delete(cartId, { transaction: t });

        await t.commit();

        return true;
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = new CartRepository();
