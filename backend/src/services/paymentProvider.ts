/**
 * Payment Provider Abstraction
 *
 * Defines the IPaymentProvider interface that any payment gateway adapter
 * (Demo, Razorpay, Stripe, etc.) must implement.
 *
 * To swap providers: implement IPaymentProvider and change the default export.
 */

export interface ProviderResult {
  /** Unique transaction reference from the gateway */
  gatewayReference: string;
  /** Whether the gateway accepted the request */
  success: boolean;
  /** Failure reason when success = false */
  failureReason?: string;
}

export interface IPaymentProvider {
  /**
   * Process a payment charge.
   * @param amount    Amount in the smallest unit (paisa for INR)
   * @param currency  ISO 4217 currency code (e.g., "INR")
   * @param method    Payment method chosen by user (UPI | CARD | NET_BANKING | WALLET)
   * @param hirerId   ID of the paying hirer
   * @param workerId  ID of the worker to receive funds
   * @param simulateFail  (Demo only) force a failure scenario
   */
  process(
    amount: number,
    currency: string,
    method: string,
    hirerId: string,
    workerId: string,
    simulateFail?: boolean,
  ): Promise<ProviderResult>;
}

import Stripe from 'stripe';

function generateDemoPaymentId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SHR-PAY-${code}`;
}

export class DemoPaymentProvider implements IPaymentProvider {
  async process(
    _amount: number,
    _currency: string,
    _method: string,
    _hirerId: string,
    _workerId: string,
    simulateFail = false,
  ): Promise<ProviderResult> {
    // Simulate realistic network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (simulateFail) {
      return {
        gatewayReference: '',
        success: false,
        failureReason: 'Simulated payment failure (demo mode)',
      };
    }

    return {
      gatewayReference: generateDemoPaymentId(),
      success: true,
    };
  }
}

// ─── Stripe Production Provider ─────────────────────────────────────────────

export class StripePaymentProvider implements IPaymentProvider {
  private stripe: Stripe | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.STRIPE_SECRET_KEY;
    if (key && key.trim() !== '') {
      this.stripe = new Stripe(key, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    }
  }

  async process(
    amount: number,
    currency: string,
    method: string,
    hirerId: string,
    workerId: string,
    simulateFail = false,
  ): Promise<ProviderResult> {
    if (simulateFail) {
      return {
        gatewayReference: '',
        success: false,
        failureReason: 'Payment authorization failed by Stripe test mode simulation',
      };
    }

    if (!this.stripe) {
      // Graceful fallback to demo reference if key is not configured
      return new DemoPaymentProvider().process(amount, currency, method, hirerId, workerId, simulateFail);
    }

    try {
      // In Stripe, amounts are in the smallest currency unit (e.g. paisa for INR or cents for USD)
      const amountInSmallestUnit = Math.round(amount * 100);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: currency.toLowerCase(),
        payment_method_types: ['card'],
        description: `SHRAMIKK Escrow Lock: Hirer ${hirerId} -> Worker ${workerId}`,
        metadata: {
          hirerId,
          workerId,
          escrowType: 'SHRAMIKK_WAGE_LOCK',
        },
      });

      return {
        gatewayReference: paymentIntent.id || generateDemoPaymentId(),
        success: true,
      };
    } catch (error: any) {
      return {
        gatewayReference: '',
        success: false,
        failureReason: error.message || 'Stripe payment intent creation failed',
      };
    }
  }
}

// ─── Active Provider Selector ───────────────────────────────────────────────
// Uses StripePaymentProvider if STRIPE_SECRET_KEY is configured in .env, otherwise DemoPaymentProvider
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
export const paymentProvider: IPaymentProvider =
  stripeApiKey && stripeApiKey.startsWith('sk_')
    ? new StripePaymentProvider(stripeApiKey)
    : new DemoPaymentProvider();

