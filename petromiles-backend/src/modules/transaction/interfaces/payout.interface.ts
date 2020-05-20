import Stripe from 'stripe';

interface PayoutCreateParams extends Stripe.PayoutCreateParams {}
interface Payout extends Stripe.Payout {}

export { PayoutCreateParams, Payout };
