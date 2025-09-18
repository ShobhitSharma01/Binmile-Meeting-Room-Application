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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const web_api_1 = require("@slack/web-api");
const config_1 = require("@nestjs/config");
let NotificationService = NotificationService_1 = class NotificationService {
    configService;
    logger = new common_1.Logger(NotificationService_1.name);
    slackClient;
    defaultChannel;
    constructor(configService) {
        this.configService = configService;
        this.slackClient = new web_api_1.WebClient(this.configService.get('SLACK_BOT_TOKEN'));
        this.defaultChannel = this.configService.get('SLACK_DEFAULT_CHANNEL') || 'CHANNEL_ID';
    }
    async sendBookingNotification(data) {
        try {
            const channel = data.channelId || this.defaultChannel;
            const message = `📢 *Room Booking Alert:* ${data.roomName} booked from *${data.startTime}* to *${data.endTime}* by *${data.employeeName}*. Please update your schedules accordingly.`;
            const result = await this.slackClient.chat.postMessage({
                channel,
                text: message,
            });
            this.logger.log(`Slack notification sent: ${result.ts}`);
        }
        catch (error) {
            this.logger.error('Error sending Slack notification', error);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map