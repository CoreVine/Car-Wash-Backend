const { Router } = require("express");
const path = require("path");

const paymentViewsRouter = Router();

// Serve payment success page
paymentViewsRouter.get("/payment-success", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/payment-success.html"));
});

// Serve payment cancel page
paymentViewsRouter.get("/payment-cancel", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/payment-cancel.html"));
});

module.exports = paymentViewsRouter; 