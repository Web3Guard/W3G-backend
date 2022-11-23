import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { RateLimiterService } from './rate_limiter.service';
import { SupabaseService } from './supabase.service';

@Module({
    providers: [RateLimiterService, PrismaService, SupabaseService],
    exports:[RateLimiterService, PrismaService, SupabaseService]
})
export class UtilsModule {}
