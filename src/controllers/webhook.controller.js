const stripe = require("../config/stripeConfig");
const OrderRepository = require("../data-access/orders");
const CartRepository = require("../data-access/carts");
const OrderStatusHistoryRepository = require("../data-access/order-status-histories");
const ProductRepository = require("../data-access/products");
const PaymentMethodRepository = require("../data-access/payment-methods");
const { BadRequestError } = require("../utils/errors/types/Api.error");

const webhookController = {
  handleStripeWebhook: async (req, res, next) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      // Verify webhook signature
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      next(error);
    }
  },

  // Verify session endpoint
  verifySession: async (req, res, next) => {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        throw new BadRequestError('Session ID is required');
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (!session) {
        throw new BadRequestError('Session not found');
      }

      // Map Stripe payment status to our status
      let paymentStatus;
      switch (session.payment_status) {
        case 'paid':
          paymentStatus = 'succeeded';
          break;
        case 'unpaid':
          if (session.status === 'complete') {
            paymentStatus = 'cancelled';
          } else if (session.status === 'expired') {
            paymentStatus = 'cancelled';
          } else {
            paymentStatus = 'pending';
          }
          break;
        case 'no_payment_required':
          paymentStatus = 'succeeded';
          break;
        default:
          paymentStatus = 'pending';
      }

      // Return session status and details
      res.json({
        status: paymentStatus,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        session_status: session.status
      });
    } catch (error) {
      console.error('Session verification error:', error);
      next(error);
    }
  }
};

async function handleCheckoutSessionCompleted(session) {
  try {
    // Find the cart using metadata
    const cart = await CartRepository.findById(session.client_reference_id);
    if (!cart) {
      throw new BadRequestError("Cart not found");
    }

    // Create or get Stripe payment method record
    let paymentMethod = await PaymentMethodRepository.findOne({
      where: { name: 'Stripe' }
    });

    if (!paymentMethod) {
      paymentMethod = await PaymentMethodRepository.create({
        name: 'Stripe',
        public_key: process.env.STRIPE_PUBLISHABLE_KEY,
        secret_key: process.env.STRIPE_SECRET_KEY
      });
    }

    // Create order
    const order = await OrderRepository.create({
      cart_order_id: cart.order_id,
      payment_method_id: paymentMethod.payment_id,
      payment_gateway_response: JSON.stringify(session),
      shipping_address: session.customer_details.address || 'No address provided'
    });

    // Update cart status to 'pending'
    await CartRepository.update(cart.order_id, {
      status: 'pending'
    });

    // Add initial status history
    await OrderStatusHistoryRepository.addOrderStatusHistory(
      order.id,
      'pending',
      'Payment completed via Stripe'
    );

    // Update product inventory
    for (const item of cart.orderItems) {
      const product = await ProductRepository.findById(item.product_id);
      if (product) {
        await ProductRepository.update(product.product_id, {
          stock: product.stock - item.quantity
        });
      }
    }

  } catch (error) {
    console.error('Error processing checkout.session.completed:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  // Additional payment success handling if needed
  console.log('PaymentIntent succeeded:', paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent) {
  // Handle failed payment if needed
  console.log('PaymentIntent failed:', paymentIntent.id);
}

module.exports = webhookController; 