import { ConfirmationTicket } from '@/interfaces/third-party-clients/confirmation-ticket.interface';
import { AddPointsRequest } from '@/interfaces/third-party-clients/add-points-request.interface';

export interface AddPointsResponse {
  request: AddPointsRequest;
  confirmationTicket: ConfirmationTicket | null;
}
