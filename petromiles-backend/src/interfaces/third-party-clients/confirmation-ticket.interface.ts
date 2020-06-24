export interface ConfirmationTicket {
  confirmationId: string;
  date: string;
  userEmail: string; // Petromiles existing user email
  currency: string; // 'usd'
  priceTag: number;
  accumulatedPoints: number;
  commission: number; // USD dollar cents | Opertative expenses
  status: string;
}
