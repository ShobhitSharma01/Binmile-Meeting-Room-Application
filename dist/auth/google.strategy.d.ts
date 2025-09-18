import { VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
declare const GoogleStrategy_base: new (...args: any) => InstanceType<any> & {
    validate(...args: any[]): unknown | Promise<unknown>;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
