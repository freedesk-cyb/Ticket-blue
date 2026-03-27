import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, password: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword, role });
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const { id: _, ...data } = updateData;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password; // Don't update if empty
    }
    await this.usersRepository.update(id, data);
    return this.usersRepository.findOne({ where: { id } }) as any;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
