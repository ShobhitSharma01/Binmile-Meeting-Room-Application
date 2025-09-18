import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
interface RmsEmployee {
    email: string;
    employee_name: string;
}
export declare class EmployeeSyncService {
    private readonly usersService;
    private readonly httpService;
    private readonly cacheManager;
    private readonly configService;
    private readonly logger;
    private readonly rmsUrl;
    constructor(usersService: UsersService, httpService: HttpService, cacheManager: Cache, configService: ConfigService);
    syncRmsEmployees(): any;
    getCachedEmployees(): Promise<RmsEmployee[]>;
}
export {};
