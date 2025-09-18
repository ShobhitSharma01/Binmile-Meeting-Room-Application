import { z } from 'zod';
export declare const GmailLoginSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type GmailLoginDto = z.infer<typeof GmailLoginSchema>;
