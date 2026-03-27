import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(username: string, password: string, role: UserRole): Promise<User>;
    findOne(username: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: number, updateData: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
