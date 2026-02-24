# Stripe Integration Setup Guide

## Overview
This application uses Stripe for processing T-Shirt payments (£10 each) through dynamic checkout sessions.

## Setup Instructions

### 1. Install Stripe Package
```bash
cd backend
npm install
```

### 2. Get Your Stripe API Keys

#### Test Mode (for development):
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Copy your **Secret key** (starts with `sk_test_`)

#### Live Mode (for production):
1. Complete Stripe account verification
2. Switch to **Live mode** in Stripe Dashboard
3. Copy your **Live Secret key** (starts with `sk_live_`)

### 3. Configure Backend Environment Variables

Create or update `/backend/.env` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
DYNAMODB_TABLE=CostumeMeasurements

# Server Configuration
PORT=5000
NODE_ENV=development

# Stripe Configuration - TEST MODE
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE

# Frontend URL (for redirect after payment)
FRONTEND_URL=http://localhost:3000
```

For production, update `/backend/.env` or set environment variables in AWS App Runner:
```env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY_HERE
FRONTEND_URL=https://your-amplify-domain.amplifyapp.com
```

### 4. Restart Backend Server

After adding the Stripe secret key:
```bash
# Stop the current server (Ctrl+C)
# Restart
npm start
```

### 5. Testing

#### Test Cards:
Use these test card numbers in Stripe Checkout:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

Any future expiry date, any CVC, and any postal code will work.

#### Testing Flow:
1. Fill out student details form
2. Select "I want to buy" for T-Shirt
3. Select T-Shirt size
4. Click "Pay £10 with Stripe"
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. You'll be redirected back with payment confirmed

### 6. Monitoring

- View test payments: [Stripe Dashboard - Test Payments](https://dashboard.stripe.com/test/payments)
- View production payments: [Stripe Dashboard - Live Payments](https://dashboard.stripe.com/payments)

## Payment Flow

1. User fills form → Clicks "Pay £10 with Stripe"
2. Backend creates Stripe Checkout Session (£10 GBP)
3. User redirected to Stripe Checkout page
4. After payment:
   - **Success:** Returns to form with `?payment_success=true&session_id=xxx`
   - **Canceled:** Returns to form with `?payment_canceled=true`
5. Frontend verifies payment with backend
6. If verified, form can be submitted

## Price Configuration

Current price: **£10** (set in `/backend/routes/stripe.js` line 28)

To change the price:
```javascript
unit_amount: 1000, // £10.00 in pence
```

Convert to pence: `£X * 100 = pence`
- £5 = 500
- £10 = 1000
- £15 = 1500

## Security Notes

⚠️ **Never commit `.env` file to git!**
⚠️ **Never expose secret keys in frontend code**
⚠️ **Always verify payments on the backend**

## Troubleshooting

### "Authentication required" error
- Check that `STRIPE_SECRET_KEY` is set in backend `.env`
- Verify the key is correct and not expired
- Restart backend server after changing `.env`

### Payment not verifying
- Check backend logs for errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check network tab for API call failures

### "Failed to create checkout session"
- Verify Stripe package is installed: `npm list stripe`
- Check backend console for detailed error messages
- Ensure AWS credentials don't interfere with Stripe API calls

## Support

For Stripe API documentation: https://stripe.com/docs/api
For webhook setup (future): https://stripe.com/docs/webhooks
