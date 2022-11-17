import { Module } from '@nestjs/common';
import { InstantController } from './instant.controller';
import { InstantService } from './instant.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [InstantController],
  providers: [InstantService],
})
export class InstantModule {}
