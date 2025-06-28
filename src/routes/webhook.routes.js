const express = require("express");
const webhookController = require("../controllers/webhook.controller");

const webhookRoutes = express.Router();

// MyFatoorah webhook endpoint - receives payment notifications
webhookRoutes.get(
  "/payments/webhook",
  webhookController.handleMyFatoorahWebhook
);

// Payment verification endpoint - for checking payment status
webhookRoutes.get("/payments/verify", webhookController.verifyPaymentStatus);

// Manual payment processing endpoint - for testing
webhookRoutes.post(
  "/payments/manual-process",
  webhookController.manualProcessPayment
);

module.exports = webhookRoutes;
