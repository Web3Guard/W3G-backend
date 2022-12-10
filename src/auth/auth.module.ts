import { Module } from '@nestjs/common';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtStrategy } from './jwt.strategy';
import { RateLimitGuard } from './rate-limit.guard';
import { WalletAddressStrategy } from './wallet.strategy';

@Module({
    imports: [UtilsModule],
    providers: [JwtStrategy, WalletAddressStrategy, RateLimitGuard],
    exports: [RateLimitGuard],
})
export class AuthModule {}
