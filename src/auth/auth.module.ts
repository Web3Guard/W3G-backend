import { Module } from '@nestjs/common';
import { JwtStrategy } from './auth.strategy';

@Module({
    providers: [JwtStrategy]
})
export class AuthModule {}
