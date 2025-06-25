const OrderRepository = require("../data-access/orders");
const CartRepository = require("../data-access/carts");
const { BadRequestError } = require("../utils/errors/types/Api.error");
const { verifyPayment } = require("../services/myfatoorah.service");

const webhookController = {
  // In your webhook.controller.js

  handleMyFatoorahWebhook: async (req, res, next) => {
    try {
      const data = req.body || {};
      const queryParams = req.query || {};

      const paymentId =
        data.InvoiceId || queryParams.paymentId || queryParams.Id;
      const status = data.InvoiceStatus || "Pending";

      if (!paymentId) {
        return res.status(400).json({
          received: false,
          message: "Payment ID is required",
        });
      }

      switch (status) {
        case "Paid":
          if (!data.CustomerReference) {
            return res.status(400).json({
              received: false,
              message: "CustomerReference is required for paid payments",
            });
          }

          await OrderRepository.createFromPaidCart(data.CustomerReference, {
            paymentId,
            status,
            customerReference: data.CustomerReference,
            rawResponse: data,
          });

          return res.json({
            received: true,
            message: "Payment processed successfully",
          });

        case "Pending":
          return res.json({
            received: true,
            message: "Payment not completed - still pending",
            paymentId,
            status,
          });

        case "Failed":
        case "Cancelled":
          return res.json({
            received: true,
            message: `Payment ${status.toLowerCase()}`,
            paymentId,
            status,
          });

        default:
          return res.json({
            received: true,
            message: `Unknown payment status: ${status}`,
            paymentId,
            status,
          });
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({
        received: false,
        message: "Internal server error processing webhook",
      });
    }
  },
  // Verify payment status endpoint for MyFatoorah
  verifyPaymentStatus: async (req, res, next) => {
    try {
      const { payment_id, order_id } = req.query;

      if (!payment_id && !order_id) {
        throw new BadRequestError("Either payment_id or order_id is required");
      }

      let paymentStatus = "pending";
      let orderExists = false;
      let cartStatus = "cart";

      if (payment_id) {
        // Verify with MyFatoorah API
        const paymentData = await verifyPayment(payment_id);

        // Map MyFatoorah status to our status
        switch (paymentData.status) {
          case "Paid":
            paymentStatus = "succeeded";
            break;
          case "Failed":
          case "Cancelled":
            paymentStatus = "failed";
            break;
          case "Pending":
          default:
            paymentStatus = "pending";
            break;
        }

        // Check if order exists for this payment
        if (paymentData.customerReference) {
          const order = await OrderRepository.findOne({
            where: { cart_order_id: paymentData.customerReference },
          });
          orderExists = !!order;

          // Get cart status
          const cart = await CartRepository.findById(
            paymentData.customerReference
          );
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
          customer_reference: paymentData.customerReference,
        });
      }

      if (order_id) {
        // Check by order_id (cart order_id)
        const cart = await CartRepository.findById(order_id);
        if (cart) {
          cartStatus = cart.status;
        }

        const order = await OrderRepository.findOne({
          where: { cart_order_id: order_id },
        });
        orderExists = !!order;

        if (order) {
          paymentStatus = order.payment_status || "pending";
        }

        return res.json({
          order_id: order_id,
          payment_status: paymentStatus,
          order_exists: orderExists,
          cart_status: cartStatus,
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error.message);
      next(error);
    }
  },

  // Manual test endpoint to process a payment
  manualProcessPayment: async (req, res, next) => {
    try {
      const { paymentId, cartOrderId } = req.body;

      if (!paymentId || !cartOrderId) {
        throw new BadRequestError("Payment ID and Cart Order ID are required");
      }

      console.log(`Manual processing for cart: ${cartOrderId}`);

      const paymentData = {
        paymentId: paymentId,
        status: "Paid",
        customerReference: cartOrderId,
        rawResponse: {
          manual: true,
          paymentId: paymentId,
          note: "Manually processed",
        },
      };

      const order = await OrderRepository.createFromPaidCart(
        cartOrderId,
        paymentData
      );

      return res.json({
        message: "Payment processed successfully",
        orderId: order.id,
        cartId: cartOrderId,
      });
    } catch (error) {
      console.error("Manual payment processing error:", error);
      next(error);
    }
  },
};

module.exports = webhookController;
