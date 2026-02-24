const express = require('express');
const router = express.Router();
require('dotenv').config();

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @route   POST /api/stripe/create-checkout-session
 * @desc    Create a Stripe Checkout Session for T-Shirt payment
 * @access  Public
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { customerName, tshirtSize } = req.body;

    // Validate input
    if (!customerName || !tshirtSize) {
      return res.status(400).json({
        error: 'Customer name and T-shirt size are required'
      });
    }

    // Smart frontend URL detection - use origin from request or fallback to env
    let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // If request has origin header, use that (allows both local and production)
    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
      try {
        const originUrl = new URL(origin);
        frontendUrl = `${originUrl.protocol}//${originUrl.host}`;
        console.log(`🔄 Using dynamic frontend URL from request: ${frontendUrl}`);
      } catch (error) {
        console.log(`⚠️ Could not parse origin, using configured: ${frontendUrl}`);
      }
    }
    
    console.log(`💳 Creating Stripe session for ${customerName}, redirecting to: ${frontendUrl}`);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Flytoez T-Shirt',
              description: `Size: ${tshirtSize}`,
              images: ['https://via.placeholder.com/300x300?text=Flytoez+T-Shirt'], // Replace with actual image
            },
            unit_amount: 1000, // £10.00 in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/costume-measurements?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/costume-measurements?payment_canceled=true`,
      client_reference_id: customerName,
      metadata: {
        customerName: customerName,
        tshirtSize: tshirtSize,
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/stripe/verify-session/:sessionId
 * @desc    Verify a Stripe Checkout Session status
 * @access  Public
 */
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID is required'
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Stripe session verification error:', error);
    res.status(500).json({
      error: 'Failed to verify session',
      details: error.message,
    });
  }
});

module.exports = router;
