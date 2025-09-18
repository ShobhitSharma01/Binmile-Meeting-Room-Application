import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingDto } from './dto/booking.dto';
import { UpdateDto } from './dto/update.dto';
import { NotificationService } from 'src/notification/notification.service';
export declare class BookingsService {
    private readonly bookingRepositery;
    private readonly notificationService;
    constructor(bookingRepositery: Repository<Booking>, notificationService: NotificationService);
    create(bookingDto: BookingDto): Promise<string>;
    updateBooking(updateDto: UpdateDto): Promise<any>;
    deleteBooking(booking_id: string): Promise<string>;
    fetcAllBookings(userId?: string, role?: string, page?: number): Promise<{
        bookings: any[];
        totalPages: number;
    }>;
}
