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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmployeeSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSyncService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const users_service_1 = require("../users/users.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
let EmployeeSyncService = EmployeeSyncService_1 = class EmployeeSyncService {
    usersService;
    httpService;
    cacheManager;
    configService;
    logger = new common_1.Logger(EmployeeSyncService_1.name);
    rmsUrl;
    constructor(usersService, httpService, cacheManager, configService) {
        this.usersService = usersService;
        this.httpService = httpService;
        this.cacheManager = cacheManager;
        this.configService = configService;
        this.rmsUrl = this.configService.get('RMS_URL')?.toString() || '';
    }
    async syncRmsEmployees() {
        this.logger.log('Starting RMS employee sync...');
        try {
            if (!this.rmsUrl) {
                this.logger.error('RMS URL is not defined');
                return;
            }
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(this.rmsUrl));
            if (response.status !== 200 || !response.data) {
                this.logger.error('Failed to fetch RMS employee list');
                return;
            }
            const rmsEmployeesRaw = response.data;
            if (!Array.isArray(rmsEmployeesRaw)) {
                this.logger.error('Invalid RMS API response format');
                return;
            }
            const rmsEmployees = rmsEmployeesRaw
                .filter((emp) => emp.email && emp.employee_name)
                .map((emp) => ({
                email: emp.email.toLowerCase(),
                employee_name: emp.employee_name,
            }));
            const rmsMap = new Map(rmsEmployees.map((emp) => [emp.email, emp]));
            const dbUsers = await this.usersService.findAll();
            const dbMap = new Map(dbUsers.map((user) => [user.email.toLowerCase(), user]));
            const added = [];
            const updated = [];
            const removed = [];
            for (const [email, emp] of rmsMap.entries()) {
                const dbUser = dbMap.get(email);
                if (!dbUser) {
                    await this.usersService.create({
                        email: emp.email,
                        name: emp.employee_name,
                    });
                    added.push(emp.email);
                }
                else if (dbUser.name !== emp.employee_name) {
                    await this.usersService.update(dbUser.id, {
                        name: emp.employee_name,
                    });
                    updated.push(emp.email);
                }
            }
            for (const [email, dbUser] of dbMap.entries()) {
                if (!rmsMap.has(email)) {
                    await this.usersService.remove(dbUser.id);
                    removed.push(dbUser.email);
                }
            }
            await this.cacheManager.set('employees', rmsEmployees, 3600);
            if (added.length)
                this.logger.log(`Added users: ${added.join(', ')}`);
            if (updated.length)
                this.logger.log(`Updated users: ${updated.join(', ')}`);
            if (removed.length)
                this.logger.log(`Soft-deleted users: ${removed.join(', ')}`);
            this.logger.log('RMS employee sync completed.');
        }
        catch (error) {
            this.logger.error('Error syncing RMS employees', error?.message || error.stack);
        }
    }
    async getCachedEmployees() {
        const cached = await this.cacheManager.get('employees');
        if (cached)
            return cached;
        await this.syncRmsEmployees();
        const refreshed = await this.cacheManager.get('employees');
        return refreshed || [];
    }
};
exports.EmployeeSyncService = EmployeeSyncService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_7AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeSyncService.prototype, "syncRmsEmployees", null);
exports.EmployeeSyncService = EmployeeSyncService = EmployeeSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        axios_1.HttpService, Object, config_1.ConfigService])
], EmployeeSyncService);
//# sourceMappingURL=employee-sync.service.js.map