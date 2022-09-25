import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatingModule } from './rating/rating.module';
import { InstantModule } from './instant/instant.module';

@Module({
  imports: [
    RatingModule,
    ConfigModule.forRoot({ isGlobal: true }),
    InstantModule,
  ],
})
export class AppModule {}
