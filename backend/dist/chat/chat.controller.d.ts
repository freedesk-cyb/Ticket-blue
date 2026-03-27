import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(body: {
        content: string;
        sender: string;
        ticketId: number;
    }): Promise<import("./message.entity").Message>;
    getMessages(ticketId: string): Promise<import("./message.entity").Message[]>;
}
