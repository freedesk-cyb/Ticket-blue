"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users/users.service");
const user_entity_1 = require("./users/user.entity");
let AppService = class AppService {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onModuleInit() {
        const admin = await this.usersService.findOne('admin');
        if (!admin) {
            await this.usersService.create('admin', 'admin123', user_entity_1.UserRole.ADMIN);
            console.log('Admin user created');
        }
        const ti = await this.usersService.findOne('ti_tech');
        if (!ti) {
            await this.usersService.create('ti_tech', 'tech123', user_entity_1.UserRole.TI);
            console.log('TI Technician created');
        }
        const user = await this.usersService.findOne('user');
        if (!user) {
            await this.usersService.create('user', 'user123', user_entity_1.UserRole.USER);
            console.log('Default user created');
        }
    }
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AppService);
//# sourceMappingURL=app.service.js.map