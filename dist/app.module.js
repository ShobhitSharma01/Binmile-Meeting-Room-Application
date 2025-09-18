"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const bookings_module_1 = require("./bookings/bookings.module");
const rooms_module_1 = require("./rooms/rooms.module");
const typeorm_1 = require("@nestjs/typeorm");
const ormconfig_1 = require("./config/ormconfig");
const config_1 = require("@nestjs/config");
const notification_module_1 = require("./notification/notification.module");
const core_1 = require("@nestjs/core");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const common_module_1 = require("./common/common.module");
const schedule_1 = require("@nestjs/schedule");
const Joi = __importStar(require("joi"));
const envSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    CACHE_TTL: Joi.number().default(3600),
    SLACK_BOT_TOKEN: Joi.string().required(),
    SLACK_SIGNING_SECRET: Joi.string().required(),
    SLACK_DEFAULT_CHANNEL: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_DOMAIN: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().required(),
    RMS_URL: Joi.string().required(),
    PORT: Joi.number().default(3000),
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: envSchema,
            }),
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
            bookings_module_1.BookingsModule,
            auth_module_1.AuthModule,
            notification_module_1.NotificationModule,
            schedule_1.ScheduleModule.forRoot(),
            common_module_1.CommonModule,
            typeorm_1.TypeOrmModule.forRoot(ormconfig_1.typeOrmModule),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map