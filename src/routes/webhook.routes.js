const { Router } = require("express");
const express = require("express");
const webhookController = require("../controllers/webhook.controller");

const webhookRoutes = Router();

// Stripe webhook endpoint - raw body needed for signature verification
webhookRoutes.post(
  "/stripe-webhook",
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

// Payment verification endpoint
webhookRoutes.get(
  "/verify-session",
  webhookController.verifySession
);

module.exports = webhookRoutes; 