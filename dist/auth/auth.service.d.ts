import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { EmployeeSyncService } from 'src/common/employee-sync.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly employeeSyncService;
    constructor(usersService: UsersService, jwtService: JwtService, employeeSyncService: EmployeeSyncService);
    loginWithGmail(email: string): Promise<AuthResponseDto>;
}
