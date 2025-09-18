"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailLoginSchema = void 0;
const zod_1 = require("zod");
exports.GmailLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
//# sourceMappingURL=GmailLogin.dto.js.map