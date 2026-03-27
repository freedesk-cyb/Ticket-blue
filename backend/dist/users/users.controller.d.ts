import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    create(body: {
        username: string;
        password: string;
        role: UserRole;
    }): Promise<User>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
}
