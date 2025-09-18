import { RoomsService } from './rooms.service';
import type { RoomDto } from './dto/room.dto';
export declare class RoomsController {
    private readonly roomService;
    constructor(roomService: RoomsService);
    create(roomDto: RoomDto): Promise<RoomDto>;
    fetchAll(): Promise<RoomDto[]>;
}
