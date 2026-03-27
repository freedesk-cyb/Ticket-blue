import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body() body: { content: string, sender: string, ticketId: number }) {
    return this.chatService.create(body.content, body.sender, body.ticketId);
  }

  @Get(':ticketId')
  async getMessages(@Param('ticketId') ticketId: string) {
    return this.chatService.findByTicket(+ticketId);
  }
}
