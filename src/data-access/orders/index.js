const OrderModel = require('../../models/Order');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");
const CartRepository = require('../carts');
const PaymentMethodRepository = require('../payment-methods');
const OrderStatusHistoryRepository = require('../order-status-histories');
const { NotFoundError } = require('../../utils/errors/types/Api.error');

class OrderRepository extends BaseRepository {
    constructor() {
        super(OrderModel);
    }

    async findByUserId(userId, options = {}) {
        try {
            return await this.model.findAll({
                where: { user_id: userId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
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

    async findWithDetails(orderId) {
        try {
            return await this.model.findByPk(orderId, {
                include: [
                    { association: 'orderItems', include: ['product'] },
                    { association: 'carWashOrder', include: ['customerCar', 'operation'] },
                    { association: 'rentalOrder', include: ['car'] },
                    { association: 'statusHistory' },
                    { association: 'paymentMethod' }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods
    async findUserOrdersPaginated(userId, page = 1, limit = 10) {
        try {
            const options = {
                where: { user_id: userId },
                include: [
                    {
                        association: 'orderItems',
                        include: ['product']
                    },
                    {
                        association: 'carWashOrder',
                        include: ['customerCar', 'operation']
                    },
                    {
                        association: 'rentalOrder',
                        include: [
                            { 
                                association: 'car',
                                include: ['images']
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCompanyOrdersPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                include: [
                    { association: 'orderItems', include: ['product'] },
                    { association: 'statusHistory' },
                    { association: 'user', attributes: ['user_id', 'name', 'email', 'phone_number'] }
                ],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async createFromPaidCart(cartOrderId, paymentData) {
        const transaction = await this.model.sequelize.transaction();
        try {
            const cart = await CartRepository.findById(cartOrderId);
            if (!cart) {
                throw new NotFoundError('Cart not found');
            }

            // 1. Check if order already exists
            const existingOrder = await this.findOne({
                where: { cart_order_id: cart.order_id },
                transaction
            });

            if (existingOrder) {
                await transaction.commit();
                console.log(`Order already exists for cart: ${cart.order_id}`);
                return existingOrder;
            }

            // 2. Find or create payment method
            let paymentMethod = await PaymentMethodRepository.findOne({
                where: { name: 'MyFatoorah' },
                transaction
            });

            if (!paymentMethod) {
                paymentMethod = await PaymentMethodRepository.create({
                    name: 'MyFatoorah',
                    public_key: 'myfatoorah_api_key', // Placeholder
                    secret_key: 'myfatoorah_api_key'  // Placeholder
                }, { transaction });
            }

            // 3. Create the order
            const order = await this.create({
                cart_order_id: cart.order_id,
                payment_method_id: paymentMethod.payment_id,
                payment_gateway_response: JSON.stringify(paymentData.rawResponse || { manual: true, paymentId: paymentData.paymentId }),
                shipping_address: paymentData.customerAddress || 'No address provided',
                company_id: cart.carWashOrder?.company_id || null,
                user_id: cart.user_id
            }, { transaction });

            // 4. Update cart status
            await CartRepository.update(cart.order_id, { status: 'pending' }, { transaction });

            // 5. Create order status history
            await OrderStatusHistoryRepository.create({
                order_id: order.id,
                status: 'pending',
                notes: `Payment completed via MyFatoorah. Payment ID: ${paymentData.paymentId}`
            }, { transaction });

            await transaction.commit();

            console.log(`Order ${order.id} created successfully from cart ${cart.order_id}`);
            return order;

        } catch (error) {
            await transaction.rollback();
            console.error(`Failed to create order from cart ${cartOrderId}:`, error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
}

module.exports = new OrderRepository();
