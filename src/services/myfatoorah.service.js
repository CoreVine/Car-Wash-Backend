const axios = require("axios");
require("dotenv").config();

const MYFATOORAH_API_KEY = process.env.MYFATOORAH_API_KEY||"rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL";
const MYFATOORAH_API_URL = process.env.MYFATOORAH_API_URL || "https://apitest.myfatoorah.com/v2";

// Use proper callback URL configuration
const getCallbackUrl = () => {
  if (process.env.MYFATOORAH_CALLBACK_URL) {
    return process.env.MYFATOORAH_CALLBACK_URL;
  }
  
  // For development, use correct IP and port
  const serverPort = process.env.SERVER_PORT;
  const serverIP = process.env.SERVER_IP;
  
  return `http://${serverIP}:${serverPort}/api/payments/webhook`;
};

const MYFATOORAH_CALLBACK_URL = getCallbackUrl();

// Helper function to clean phone number
const cleanPhoneNumber = (phone) => {
  if (!phone) return "96500000000";
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with country code, remove it
  if (cleaned.startsWith('965')) {
    cleaned = cleaned.substring(3);
  }
  
  // Ensure it's at least 8 digits
  if (cleaned.length < 8) {
    cleaned = "00000000";
  }
  
  // Limit to 8 digits
  return cleaned.substring(0, 8);
};

/**
 * Initiate payment with MyFatoorah
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Payment amount
 * @param {string} params.customerName - Customer name
 * @param {string} params.customerEmail - Customer email
 * @param {string} params.customerPhone - Customer phone
 * @param {string|number} params.orderId - Order ID for reference
 * @returns {Object} Payment URL and details
 */
async function initiatePayment({ amount, customerName, customerEmail, customerPhone, orderId }) {
  try {
    // Validate required environment variables
    if (!MYFATOORAH_API_KEY) {
      throw new Error('MyFatoorah API key is not configured. Please set MYFATOORAH_API_KEY in environment variables.');
    }

    // Validate input parameters
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount. Amount must be greater than 0.');
    }

    if (!customerEmail) {
      throw new Error('Customer email is required.');
    }

    const headers = {
      "Authorization": `Bearer ${MYFATOORAH_API_KEY}`,
      "Content-Type": "application/json"
    };

    // Step 1: Initiate Payment
    const initiatePayload = {
      InvoiceAmount: amount,
      CurrencyIso: "KWD", // Change to your currency if needed
    };

    console.log('Initiating MyFatoorah payment with payload:', initiatePayload);

    const initiateRes = await axios.post(
      `${MYFATOORAH_API_URL}/InitiatePayment`,
      initiatePayload,
      { headers }
    );

    if (!initiateRes.data || !initiateRes.data.Data || !initiateRes.data.Data.PaymentMethods) {
      throw new Error('Invalid response from MyFatoorah InitiatePayment API');
    }

    const paymentMethodId = initiateRes.data.Data.PaymentMethods[0].PaymentMethodId;

    // Clean and format phone number
    const cleanedPhone = cleanPhoneNumber(customerPhone);

    // Step 2: Execute Payment
    const executePayload = {
      PaymentMethodId: paymentMethodId,
      CustomerName: customerName || "Customer",
      DisplayCurrencyIso: "KWD",
      MobileCountryCode: "+965",
      CustomerMobile: cleanedPhone,
      CustomerEmail: customerEmail,
      InvoiceValue: amount,
      CallBackUrl: MYFATOORAH_CALLBACK_URL,
      ErrorUrl: MYFATOORAH_CALLBACK_URL,
      Language: "EN",
      CustomerReference: orderId ? String(orderId) : undefined,
    };

    console.log('Executing MyFatoorah payment with payload:', executePayload);

    const executeRes = await axios.post(
      `${MYFATOORAH_API_URL}/ExecutePayment`,
      executePayload,
      { headers }
    );

    if (!executeRes.data || !executeRes.data.Data) {
      throw new Error('Invalid response from MyFatoorah ExecutePayment API');
    }

    return {
      paymentUrl: executeRes.data.Data.PaymentURL,
      paymentId: executeRes.data.Data.InvoiceId,
      gatewayResponse: executeRes.data
    };

  } catch (error) {
    console.error('MyFatoorah payment initiation failed:', error.message);
    
    // Handle specific MyFatoorah API errors
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      console.error('MyFatoorah API Error Details:', errorData);
      throw new Error(`MyFatoorah API Error: ${errorData.Message || errorData.Error || error.message}`);
    }
    
    throw error;
  }
}

/**
 * Verify payment status with MyFatoorah
 * @param {string} paymentId - MyFatoorah payment/invoice ID
 * @returns {Object} Payment status and details
 */
async function verifyPayment(paymentId) {
  try {
    if (!MYFATOORAH_API_KEY) {
      throw new Error('MyFatoorah API key is not configured.');
    }

    if (!paymentId) {
      throw new Error('Payment ID is required for verification.');
    }

    const headers = {
      "Authorization": `Bearer ${MYFATOORAH_API_KEY}`,
      "Content-Type": "application/json"
    };

    const response = await axios.post(
      `${MYFATOORAH_API_URL}/GetPaymentStatus`,
      { 
        Key: paymentId,
        KeyType: "InvoiceId"
      },
      { headers }
    );

    if (!response.data || !response.data.Data) {
      throw new Error('Invalid response from MyFatoorah GetPaymentStatus API');
    }

    const paymentData = response.data.Data;

    return {
      paymentId: paymentData.InvoiceId,
      status: paymentData.InvoiceStatus, // Paid, Failed, Pending, etc.
      amount: paymentData.InvoiceValue,
      customerReference: paymentData.CustomerReference,
      transactionId: paymentData.TransactionId,
      rawResponse: response.data
    };

  } catch (error) {
    console.error('MyFatoorah payment verification failed:', error.message);
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      throw new Error(`MyFatoorah API Error: ${errorData.Message || error.message}`);
    }
    
    throw error;
  }
}

module.exports = {
  initiatePayment,
  verifyPayment,
};