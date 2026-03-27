import { OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
export declare class AppService implements OnModuleInit {
    private usersService;
    constructor(usersService: UsersService);
    onModuleInit(): Promise<void>;
    getHello(): string;
}
