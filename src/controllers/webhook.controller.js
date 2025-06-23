const OrderRepository = require("../data-access/orders");
const CartRepository = require("../data-access/carts");
const OrderStatusHistoryRepository = require("../data-access/order-status-histories");
const ProductRepository = require("../data-access/products");
const PaymentMethodRepository = require("../data-access/payment-methods");
const { BadRequestError, NotFoundError } = require("../utils/errors/types/Api.error");
const { verifyPayment } = require("../services/myfatoorah.service");

const webhookController = {
  handleMyFatoorahWebhook: async (req, res, next) => {
    try {
      console.log('=== MYFATOORAH WEBHOOK RECEIVED ===');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      
      const data = req.body;
      const status = data.InvoiceStatus;
      const paymentId = data.InvoiceId;
      const customerReference = data.CustomerReference; // This is our cart order_id
      
      console.log(`Payment status: ${status}, Payment ID: ${paymentId}, Customer Reference: ${customerReference}`);
      
      if (status === 'Paid') {
        if (!customerReference) {
          console.log('Webhook received without a CustomerReference (cartId). Cannot process.');
          return res.json({ received: true, message: 'CustomerReference is missing' });
        }
        
        const paymentData = {
          paymentId: paymentId,
          status: status,
          customerReference: customerReference,
          rawResponse: data
        };

        await OrderRepository.createFromPaidCart(customerReference, paymentData);
        
        return res.json({ received: true, message: 'Payment processed successfully' });

      } else {
        console.log(`Payment not completed. Status: ${status}`);
        return res.json({ received: true, message: 'Payment not completed' });
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return next(error);
    }
  },

  // Verify payment status endpoint for MyFatoorah
  verifyPaymentStatus: async (req, res, next) => {
    try {
      const { payment_id, order_id } = req.query;

      if (!payment_id && !order_id) {
        throw new BadRequestError('Either payment_id or order_id is required');
      }

      let paymentStatus = 'pending';
      let orderExists = false;
      let cartStatus = 'cart';

      if (payment_id) {
        // Verify with MyFatoorah API
        const paymentData = await verifyPayment(payment_id);
        
        // Map MyFatoorah status to our status
        switch (paymentData.status) {
          case 'Paid':
            paymentStatus = 'succeeded';
            break;
          case 'Failed':
          case 'Cancelled':
            paymentStatus = 'failed';
            break;
          case 'Pending':
          default:
            paymentStatus = 'pending';
            break;
        }

        // Check if order exists for this payment
        if (paymentData.customerReference) {
          const order = await OrderRepository.findOne({
            where: { cart_order_id: paymentData.customerReference }
          });
          orderExists = !!order;

          // Get cart status
          const cart = await CartRepository.findById(paymentData.customerReference);
          if (cart) {
            cartStatus = cart.status;
          }
        }

        return res.json({
          payment_id: payment_id,
          payment_status: paymentStatus,
          order_exists: orderExists,
          cart_status: cartStatus,
          amount: paymentData.amount,
          customer_reference: paymentData.customerReference
        });
      }

      if (order_id) {
        // Check by order_id (cart order_id)
        const cart = await CartRepository.findById(order_id);
        if (cart) {
          cartStatus = cart.status;
        }

        const order = await OrderRepository.findOne({
          where: { cart_order_id: order_id }
        });
        orderExists = !!order;

        if (order) {
          paymentStatus = order.payment_status || 'pending';
        }

        return res.json({
          order_id: order_id,
          payment_status: paymentStatus,
          order_exists: orderExists,
          cart_status: cartStatus
        });
      }

    } catch (error) {
      console.error('Payment verification error:', error.message);
      next(error);
    }
  },

  // Manual test endpoint to process a payment
  manualProcessPayment: async (req, res, next) => {
    try {
      const { paymentId, cartOrderId } = req.body;
      
      if (!paymentId || !cartOrderId) {
        throw new BadRequestError('Payment ID and Cart Order ID are required');
      }

      console.log(`Manual processing for cart: ${cartOrderId}`);

      const paymentData = {
        paymentId: paymentId,
        status: 'Paid',
        customerReference: cartOrderId,
        rawResponse: { manual: true, paymentId: paymentId, note: 'Manually processed' }
      };

      const order = await OrderRepository.createFromPaidCart(cartOrderId, paymentData);
      
      return res.json({ 
        message: 'Payment processed successfully', 
        orderId: order.id,
        cartId: cartOrderId
      });

    } catch (error) {
      console.error('Manual payment processing error:', error);
      next(error);
    }
  }
};

module.exports = webhookController; 