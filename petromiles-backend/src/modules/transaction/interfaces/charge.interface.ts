import Stripe from 'stripe';

interface ChargeCreateParams extends Stripe.ChargeCreateParams {}
interface Charge extends Stripe.Charge {}

interface ChargeCreateDTO extends ChargeCreateParams {}

export { ChargeCreateParams, Charge, ChargeCreateDTO };
