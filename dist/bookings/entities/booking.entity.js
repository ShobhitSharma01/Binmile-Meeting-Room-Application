"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const room_entity_1 = require("src/rooms/entities/room.entity");
const user_entity_1 = require("src/users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Booking = class Booking {
    id;
    user;
    room;
    startTime;
    endTime;
    deletedAt;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.bookings, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", typeof (_b = typeof room_entity_1.Room !== "undefined" && room_entity_1.Room) === "function" ? _b : Object)
], Booking.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Booking.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Booking.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Booking.prototype, "deletedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
//# sourceMappingURL=booking.entity.js.map