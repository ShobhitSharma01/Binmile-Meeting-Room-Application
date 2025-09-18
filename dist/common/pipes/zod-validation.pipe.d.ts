import { PipeTransform } from '@nestjs/common';
import { ZodTypeAny } from 'zod';
export declare class ZodValidationPipe implements PipeTransform {
    private schema;
    constructor(schema: ZodTypeAny);
    transform(value: any): unknown;
}
