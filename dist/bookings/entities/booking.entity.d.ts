import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Booking {
    id: string;
    user: User;
    room: Room;
    startTime: Date;
    endTime: Date;
    deletedAt?: Date;
}
