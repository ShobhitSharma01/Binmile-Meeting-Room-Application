import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
export declare class RoomsService {
    private roomRepositery;
    constructor(roomRepositery: Repository<Room>);
    create(roomData: RoomDto): Promise<Room>;
    fetchAll(): Promise<Room[]>;
}
