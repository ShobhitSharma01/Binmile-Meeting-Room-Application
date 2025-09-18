"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const employee_sync_service_1 = require("./employee-sync.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const axios_1 = require("@nestjs/axios");
const users_module_1 = require("src/users/users.module");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, axios_1.HttpModule, cache_manager_1.CacheModule.register()],
        providers: [logger_service_1.LoggerService, logging_interceptor_1.LoggingInterceptor, employee_sync_service_1.EmployeeSyncService],
        exports: [logger_service_1.LoggerService, logging_interceptor_1.LoggingInterceptor, employee_sync_service_1.EmployeeSyncService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map