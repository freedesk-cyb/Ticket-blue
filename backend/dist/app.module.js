"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ticket_module_1 = require("./tickets/ticket.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const chat_module_1 = require("./chat/chat.module");
const user_entity_1 = require("./users/user.entity");
const ticket_entity_1 = require("./tickets/ticket.entity");
const message_entity_1 = require("./chat/message.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    if (process.env.POSTGRES_URL) {
                        return {
                            type: 'postgres',
                            url: process.env.POSTGRES_URL,
                            entities: [user_entity_1.User, ticket_entity_1.Ticket, message_entity_1.Message],
                            synchronize: true,
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
                        entities: [user_entity_1.User, ticket_entity_1.Ticket, message_entity_1.Message],
                        synchronize: true,
                    };
                },
            }),
            ticket_module_1.TicketModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map