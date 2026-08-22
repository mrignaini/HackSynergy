import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import Stripe from 'stripe';

async function testStripeConnection() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  console.log('Testing Stripe Connection...');
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 12) + '...' : 'NONE');

  if (!apiKey) {
    console.error('No STRIPE_SECRET_KEY found in .env');
    process.exit(1);
  }

  const stripe = new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia' as any,
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100000, // 1000 INR = 100000 paisa
      currency: 'inr',
      payment_method_types: ['card'],
      description: 'SHRAMIKK Escrow Test: Masonry Work Wage Lock',
      metadata: {
        platform: 'SHRAMIKK',
        mode: 'ESCROW_WAGE_LOCK',
        workerId: 'w-101',
        hirerId: 'h-201',
      },
    });

    console.log('✓ Stripe PaymentIntent Created Successfully!');
    console.log('PaymentIntent ID:', paymentIntent.id);
    console.log('Status:', paymentIntent.status);
    console.log('Amount:', paymentIntent.amount / 100, paymentIntent.currency.toUpperCase());
    console.log('Client Secret available:', !!paymentIntent.client_secret);
  } catch (err: any) {
    console.error('Stripe API error:', err.message);
  }
}

testStripeConnection();
