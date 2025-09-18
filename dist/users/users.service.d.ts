import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByID(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
}
