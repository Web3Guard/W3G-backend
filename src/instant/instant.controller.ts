import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';
import {
  InstantMethodResponse,
  InstantService,
} from 'src/instant/instant.service';
import { TransactionDto } from 'src/instant/dto/transaction-dto';
import { RateLimitGuard } from 'src/auth/rate_limit.guard';

@Controller('instant')
@UseGuards(RateLimitGuard)
export class InstantController {
  constructor(private instantService: InstantService) {}

  @Post()
  startSimulate(@Body() body: TransactionDto, @Request() req): Promise<InstantMethodResponse> {
    console.log(req.user, typeof req)
    return this.instantService.startSimulate(body);
  }
}
