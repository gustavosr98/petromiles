export interface AssociateUserTokenRequest {
  apiKey: string; // Platform unique identifier provided by Petromiles secretly
  userEmail: string; // Petromiles existing user email
  userCode: string; // 8 digit code send to user by email
}
