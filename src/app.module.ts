import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatingModule } from './rating/rating.module';
import { InstantModule } from './instant/instant.module';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from './utils/prisma.service';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req(req) {
            req.body = req.raw.body;
            return req;
          },
          res(res) {
            res.body = res.raw.body;
            return res;
          }
        },
        customProps: (req, res) => ({
          context: 'HTTP'
        }),
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    InstantModule,
    RatingModule,
    UtilsModule,
    AuthModule
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard('jwt'),
    },
  ],
})
export class AppModule {}
