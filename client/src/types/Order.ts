import { Ticket } from './Ticket';

export interface Order {
  id: string;
  status: string;
  userId: string;
  expiresAt: Date;
  ticket: Ticket;
}
