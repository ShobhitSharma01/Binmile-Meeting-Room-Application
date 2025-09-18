import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: any] | [opt: any]) => InstanceType<typeof Strategy> & {
    validate(...args: any[]): unknown | Promise<unknown>;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): unknown;
}
export {};
