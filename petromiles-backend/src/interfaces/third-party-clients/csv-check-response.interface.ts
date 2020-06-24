import { ConfirmationTicket } from '@/interfaces/third-party-clients/confirmation-ticket.interface';
import { CsvCheckRequest } from '@/interfaces/third-party-clients/csv-check-request.interface';

export interface CsvCheckResponse {
  request: CsvCheckRequest;
  confirmationTickets: ConfirmationTicket[];
}
