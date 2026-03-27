import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './tickets/ticket.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { User } from './users/user.entity';
import { Ticket } from './tickets/ticket.entity';
import { Message } from './chat/message.entity';

@Module({
  imports: [
    /*
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.POSTGRES_URL) {
          return {
            type: 'postgres',
            url: process.env.POSTGRES_URL,
            entities: [User, Ticket, Message],
            synchronize: false, // Disable auto-sync to avoid hangs
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
              connectionTimeoutMillis: 5000,
              query_timeout: 5000,
              statement_timeout: 5000,
            },
          };
        }
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          entities: [User, Ticket, Message],
          synchronize: true,
        };
      },
    }),
    */
    /*
    TicketModule,
    AuthModule,
    UsersModule,
    ChatModule,
    */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
