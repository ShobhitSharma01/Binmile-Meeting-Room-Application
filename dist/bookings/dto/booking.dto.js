"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = void 0;
const zod_1 = require("zod");
exports.BookingSchema = zod_1.z
    .object({
    room_id: zod_1.z.string().uuid(),
    employee_id: zod_1.z.string().uuid(),
    startTime: zod_1.z.string().transform((val, ctx) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Invalid date format',
            });
            return zod_1.z.NEVER;
        }
        return date;
    }),
    endTime: zod_1.z.string().transform((val, ctx) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Invalid date format',
            });
            return zod_1.z.NEVER;
        }
        return date;
    }),
})
    .refine((data) => data.endTime > data.startTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
});
//# sourceMappingURL=booking.dto.js.map