import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RateLimiterService } from "src/utils/rate_limiter.service";

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(private rateLimiter: RateLimiterService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        this.rateLimiter.checkRateLimit(req.user.id);
        return this.rateLimiter.incrementRequestCount(req.user.id);
    }
    
}