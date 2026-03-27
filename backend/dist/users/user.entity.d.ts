export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    TI = "ti",
    HELPDESK = "helpdesk"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
}
