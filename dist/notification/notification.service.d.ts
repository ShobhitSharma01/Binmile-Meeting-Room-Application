import { ConfigService } from '@nestjs/config';
export declare class NotificationService {
    private configService;
    private readonly logger;
    private slackClient;
    private defaultChannel;
    constructor(configService: ConfigService);
    sendBookingNotification(data: {
        employeeName: string;
        roomName: string;
        startTime: string;
        endTime: string;
        channelId?: string;
    }): any;
}
