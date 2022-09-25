import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RatingController } from './controller/rating/rating.controller';
import { RatingService } from './service/rating/rating.service';

@Module({
  imports: [HttpModule],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
