import type { BookingDto } from './dto/booking.dto';
import { BookingsService } from './bookings.service';
import type { UpdateDto } from './dto/update.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(bookingDto: BookingDto): Promise<string>;
    getBookings(req: any, userId?: string, page?: number): Promise<{
        bookings: any[];
        totalPages: number;
    }>;
    updateBookings(updateDto: UpdateDto): Promise<any>;
    deleteBookings(booking_id: string): Promise<string>;
}
