"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = void 0;
const zod_1 = require("zod");
exports.RoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Room name must have at least 2 characters' }),
});
//# sourceMappingURL=room.dto.js.map