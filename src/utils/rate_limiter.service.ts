import { Injectable } from "@nestjs/common";
import { ApiLimitExceddedException } from "src/errors";
import { PrismaService } from "src/utils/prisma.service";

@Injectable()
export class RateLimiterService {
    constructor(private readonly prisma: PrismaService) {}

    async checkRateLimit(userId: string) {
        const userProfile = await this.prisma.profiles.findUniqueOrThrow({
            where: { user_id: userId },
        })
        if (userProfile.request_count >= userProfile.api_limit) {
            throw new ApiLimitExceddedException(userProfile.api_limit);
        }
    }

    async incrementRequestCount(userId: string) {
        const updateCount = await this.prisma.profiles.updateMany({
            where: { 
                user_id: userId,
                request_count: {
                    lt: this.prisma.profiles.fields.api_limit 
                }
            },
            data: {
                request_count: { increment: 1 }
            }
        })
        if (updateCount.count == 0) {
            this.checkRateLimit(userId);
        }
        return true
    }
}