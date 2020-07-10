export interface ConfirmationTicket {
  confirmationId: string;
  apiKey?: string;
  date: string;
  userEmail: string; // Petromiles existing user email
  currency: string; // 'usd'
  pointsToDollars: number;
  accumulatedPoints: number;
  commission: number; // USD dollar cents | Opertative expenses
  status: string;
}
