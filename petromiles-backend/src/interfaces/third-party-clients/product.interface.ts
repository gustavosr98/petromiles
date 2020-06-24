export interface Product {
  id: string; // Not signifinative to Petromiles. Only to be used as reference for third party clients
  priceTag: number; // USD dollar cents Ej. 1000 = $1
  currency: string; // Ej. 'usd'
  tentativeCommission?: number; // USD dollar cents | Opertative expenses
  tentativePoints?: number;
}
