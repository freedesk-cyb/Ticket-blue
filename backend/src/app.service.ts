import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    const admin = await this.usersService.findOne('admin');
    if (!admin) {
      await this.usersService.create('admin', 'admin123', UserRole.ADMIN);
      console.log('Admin user created');
    }

    const ti = await this.usersService.findOne('ti_tech');
    if (!ti) {
      await this.usersService.create('ti_tech', 'tech123', UserRole.TI);
      console.log('TI Technician created');
    }

    const user = await this.usersService.findOne('user');
    if (!user) {
      await this.usersService.create('user', 'user123', UserRole.USER);
      console.log('Default user created');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
