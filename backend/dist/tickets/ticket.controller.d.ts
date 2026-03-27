import { TicketService } from './ticket.service';
import { Ticket } from './ticket.entity';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    create(ticketData: Partial<Ticket>): Promise<Ticket>;
    findAll(department?: string, createdBy?: string): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>): Promise<Ticket>;
    remove(id: string): Promise<void>;
}
