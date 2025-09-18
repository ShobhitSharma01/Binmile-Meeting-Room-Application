import { Booking } from 'src/bookings/entities/booking.entity';
export type UserRole = 'admin' | 'manager' | 'employee';
export declare class User {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    bookings: Booking[];
}
