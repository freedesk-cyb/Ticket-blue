import { Message } from '../chat/message.entity';
export declare enum TicketStatus {
    OPEN = "Open",
    IN_PROGRESS = "In Progress",
    RESOLVED = "Resolved",
    CLOSED = "Closed"
}
export declare enum TicketPriority {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
    CRITICAL = "Critical"
}
export declare enum TicketDepartment {
    TI = "Soporte TI",
    HELPDESK = "Mesa de Ayuda"
}
export declare class Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    department: TicketDepartment;
    createdBy: string;
    assignedTo: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}
