import { Repository } from 'typeorm';
import { Message } from './message.entity';
export declare class ChatService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(content: string, sender: string, ticketId: number): Promise<Message>;
    findByTicket(ticketId: number): Promise<Message[]>;
}
