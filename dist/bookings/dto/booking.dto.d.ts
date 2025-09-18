import { z } from 'zod';
export declare const BookingSchema: z.ZodObject<{
    room_id: z.ZodString;
    employee_id: z.ZodString;
    startTime: z.ZodPipe<z.ZodString, z.ZodTransform<Awaited<NewOut>, string>>;
    endTime: z.ZodPipe<z.ZodString, z.ZodTransform<Awaited<NewOut>, string>>;
}, z.core.$strip>;
export type BookingDto = z.infer<typeof BookingSchema>;
