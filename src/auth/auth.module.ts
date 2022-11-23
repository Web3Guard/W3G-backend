import { Module } from '@nestjs/common';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtStrategy } from './jwt.strategy';
import { WalletAddressStrategy } from './wallet_address.strategy';

@Module({
    imports: [UtilsModule],
    providers: [JwtStrategy, WalletAddressStrategy]
})
export class AuthModule {}
