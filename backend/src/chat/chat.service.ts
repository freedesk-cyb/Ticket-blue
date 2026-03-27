import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(content: string, sender: string, ticketId: number): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      sender,
      ticket: { id: ticketId } as any,
    });
    return this.messageRepository.save(message);
  }

  async findByTicket(ticketId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { ticket: { id: ticketId } },
      order: { createdAt: 'ASC' },
    });
  }
}
