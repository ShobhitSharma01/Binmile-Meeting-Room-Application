import { z } from 'zod';
export declare const RoomSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type RoomDto = z.infer<typeof RoomSchema>;
