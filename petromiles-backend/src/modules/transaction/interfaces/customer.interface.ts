import Stripe from 'stripe';

interface CustomerCreateParams extends Stripe.CustomerCreateParams {}
interface CustomerUpdateParams extends Stripe.CustomerUpdateParams {}
interface Customer extends Stripe.Customer {}
interface DeletedCustomer extends Stripe.DeletedCustomer {}

export {
  CustomerCreateParams,
  CustomerUpdateParams,
  Customer,
  DeletedCustomer,
};
