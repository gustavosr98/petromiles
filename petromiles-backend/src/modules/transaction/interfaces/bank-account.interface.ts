import Stripe from 'stripe';

interface CreateBankAccountParams extends Stripe.TokenCreateParams {
  userEmail?: string;
}
interface BankAccount extends Stripe.Source {}

export { CreateBankAccountParams, BankAccount };
