import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
export declare class TicketService {
    private ticketRepository;
    constructor(ticketRepository: Repository<Ticket>);
    create(ticketData: Partial<Ticket>): Promise<Ticket>;
    findAll(department?: string, createdBy?: string): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket>;
    update(id: number, updateData: Partial<Ticket>): Promise<Ticket>;
    remove(id: number): Promise<void>;
}
