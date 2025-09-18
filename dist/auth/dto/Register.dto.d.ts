import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{}>;
    managerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
