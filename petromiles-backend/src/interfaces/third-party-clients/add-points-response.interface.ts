import { ConfirmationTicket } from '@/interfaces/third-party-clients/confirmation-ticket.interface';
import { AddPointsRequest } from '@/modules/third-party-clients/dto/add-points-request.dto';

export interface AddPointsResponse {
  request: AddPointsRequest;
  confirmationTicket: ConfirmationTicket | null;
}
