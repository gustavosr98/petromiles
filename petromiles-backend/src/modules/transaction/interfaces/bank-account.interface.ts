import Stripe from 'stripe';

interface CreateBankAccountParams extends Stripe.TokenCreateParams {}
interface BankAccount extends Stripe.Token {}

export { CreateBankAccountParams, BankAccount };
