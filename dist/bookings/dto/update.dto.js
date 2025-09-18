"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchema = void 0;
const zod_1 = require("zod");
exports.UpdateSchema = zod_1.z.object({
    booking_id: zod_1.z.string().uuid(),
    room_id: zod_1.z.string().uuid(),
    start_time: zod_1.z.coerce.date(),
    end_time: zod_1.z.coerce.date(),
});
//# sourceMappingURL=update.dto.js.map