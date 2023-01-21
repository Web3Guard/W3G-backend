import { Module } from '@nestjs/common';
import { InstantController } from './instant.controller';
import { InstantService } from './instant.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [HttpModule, AuthModule, UtilsModule],
  controllers: [InstantController],
  providers: [InstantService],
})
export class InstantModule {}
