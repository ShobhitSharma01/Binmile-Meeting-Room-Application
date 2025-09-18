"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.typeOrmModule = void 0;
const typeorm_1 = require("typeorm");
exports.typeOrmModule = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'nestDB',
    synchronize: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun: true,
};
exports.AppDataSource = new typeorm_1.DataSource(exports.typeOrmModule);
//# sourceMappingURL=ormconfig.js.map