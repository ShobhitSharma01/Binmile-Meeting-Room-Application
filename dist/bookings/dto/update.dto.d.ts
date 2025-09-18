import { z } from 'zod';
export declare const UpdateSchema: z.ZodObject<{
    booking_id: z.ZodString;
    room_id: z.ZodString;
    start_time: z.ZodCoercedDate<unknown>;
    end_time: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type UpdateDto = z.infer<typeof UpdateSchema>;
