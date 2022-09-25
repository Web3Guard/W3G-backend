import { Module } from '@nestjs/common';
import { InstantController } from './controller/instant/instant.controller';
import { InstantService } from './service/instant/instant.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [InstantController],
  providers: [InstantService],
})
export class InstantModule {}
