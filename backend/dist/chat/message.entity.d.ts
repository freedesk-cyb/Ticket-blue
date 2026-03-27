import { Ticket } from '../tickets/ticket.entity';
export declare class Message {
    id: number;
    content: string;
    sender: string;
    createdAt: Date;
    ticket: Ticket;
}
