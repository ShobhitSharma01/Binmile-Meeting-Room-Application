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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("src/rooms/entities/room.entity");
const user_entity_1 = require("src/users/entities/user.entity");
const notification_service_1 = require("src/notification/notification.service");
let BookingsService = class BookingsService {
    bookingRepositery;
    notificationService;
    constructor(bookingRepositery, notificationService) {
        this.bookingRepositery = bookingRepositery;
        this.notificationService = notificationService;
    }
    async create(bookingDto) {
        const { room_id, employee_id, startTime, endTime } = bookingDto;
        const startObj = new Date(startTime);
        const endObj = new Date(endTime);
        if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (startObj < new Date()) {
            throw new common_1.BadRequestException('Start time must be in the future');
        }
        if (endObj <= startObj) {
            throw new common_1.BadRequestException('End time must be greater than start time');
        }
        return await this.bookingRepositery.manager.transaction(async (manager) => {
            await manager
                .createQueryBuilder(room_entity_1.Room, 'room')
                .setLock('pessimistic_write')
                .where('room.id = :room_id', { room_id })
                .getOne();
            const roomConflict = await manager
                .createQueryBuilder(booking_entity_1.Booking, 'b')
                .where('b.room = :room_id', { room_id })
                .andWhere('b.endTime > :startTime', { startTime: startObj })
                .andWhere('b.startTime < :endTime', { endTime: endObj })
                .getOne();
            if (roomConflict) {
                throw new common_1.ConflictException(`Room already booked from ${startObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })} to ${endObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })}`);
            }
            const userConflict = await manager
                .createQueryBuilder(booking_entity_1.Booking, 'b')
                .where('b.user = :employee_id', { employee_id })
                .andWhere('b.endTime > :startTime', { startTime: startObj })
                .andWhere('b.startTime < :endTime', { endTime: endObj })
                .getOne();
            if (userConflict) {
                throw new common_1.ConflictException('User already has a booking in this time slot');
            }
            const newBooking = manager.create(booking_entity_1.Booking, {
                room: { id: room_id },
                user: { id: employee_id },
                startTime: startObj,
                endTime: endObj,
            });
            await manager.save(newBooking);
            const employee = await manager.findOne(user_entity_1.User, {
                where: { id: employee_id },
            });
            const room = await manager.findOne(room_entity_1.Room, { where: { id: room_id } });
            await this.notificationService.sendBookingNotification({
                employeeName: employee ? employee.name : `Employee ${employee_id}`,
                roomName: room ? `${room.name} Room` : `Room ${room_id}`,
                startTime: startObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                endTime: endObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });
            return 'Booking created successfully';
        });
    }
    async updateBooking(updateDto) {
        const { room_id, booking_id, start_time, end_time } = updateDto;
        if (!booking_id)
            throw new common_1.BadRequestException('Booking ID is required');
        if (!room_id)
            throw new common_1.BadRequestException('Room ID is required');
        const startObj = new Date(start_time);
        const endObj = new Date(end_time);
        if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (startObj < new Date()) {
            throw new common_1.BadRequestException('Start time must be in future');
        }
        if (endObj <= startObj) {
            throw new common_1.BadRequestException('End time must be greater than start time');
        }
        const existingBooking = await this.bookingRepositery.findOne({
            where: { id: booking_id },
            relations: ['room', 'user'],
        });
        if (!existingBooking)
            throw new common_1.NotFoundException('Booking not found');
        const roomConflict = await this.bookingRepositery
            .createQueryBuilder('b')
            .where('b.id != :booking_id', { booking_id })
            .andWhere('b.room = :room_id', { room_id })
            .andWhere('b.endTime > :startTime', { startTime: startObj })
            .andWhere('b.startTime < :endTime', { endTime: endObj })
            .getOne();
        if (roomConflict) {
            throw new common_1.ConflictException(`Room is already booked from ${new Date(roomConflict.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })} to ${new Date(roomConflict.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}`);
        }
        const userConflict = await this.bookingRepositery
            .createQueryBuilder('b')
            .where('b.id != :booking_id', { booking_id })
            .andWhere('b.user = :user_id', { user_id: existingBooking.user.id })
            .andWhere('b.endTime > :startTime', { startTime: startObj })
            .andWhere('b.startTime < :endTime', { endTime: endObj })
            .getOne();
        if (userConflict) {
            throw new common_1.ConflictException(`You already have a booking from ${new Date(userConflict.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })} to ${new Date(userConflict.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })} in another room`);
        }
        existingBooking.startTime = startObj;
        existingBooking.endTime = endObj;
        const saved = await this.bookingRepositery.save(existingBooking);
        if (this.notificationService) {
            await this.notificationService.sendBookingNotification({
                employeeName: saved.user?.name || `Employee ${saved.user?.id}`,
                roomName: saved.room?.name || `Room ${saved.room?.id}`,
                startTime: startObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                endTime: endObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });
        }
        return {
            booking_id: saved.id,
            room_id: saved.room?.id || room_id,
            start_time: saved.startTime,
            end_time: saved.endTime,
        };
    }
    async deleteBooking(booking_id) {
        if (!booking_id)
            throw new common_1.BadRequestException('Booking ID is required');
        const existingBooking = await this.bookingRepositery.findOne({
            where: { id: booking_id },
        });
        if (!existingBooking)
            throw new common_1.NotFoundException('Booking not found');
        await this.bookingRepositery.softRemove(existingBooking);
        return 'Deleted successfully';
    }
    async fetcAllBookings(userId, role, page = 1) {
        const limit = 50;
        const offset = (page - 1) * limit;
        let query = this.bookingRepositery
            .createQueryBuilder('b')
            .leftJoinAndSelect('b.room', 'room')
            .leftJoinAndSelect('b.user', 'user');
        const totalCount = await query.getCount();
        const totalPages = Math.ceil(totalCount / limit);
        query = query.orderBy('b.startTime', 'DESC').limit(limit).offset(offset);
        const bookings = await query.getMany();
        const grouped = new Map();
        bookings.forEach((b) => {
            if (!grouped.has(b.room.id)) {
                grouped.set(b.room.id, {
                    room_id: b.room.id,
                    room_name: b.room.name,
                    bookings: [],
                });
            }
            grouped.get(b.room.id).bookings.push({
                booking_id: b.id,
                user_id: b.user.id,
                booked_by: b.user.name,
                start_time: b.startTime,
                end_time: b.endTime,
            });
        });
        return {
            bookings: Array.from(grouped.values()) || [],
            totalPages,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map