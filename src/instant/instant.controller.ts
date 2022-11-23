import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';
import {
  InstantMethodResponse,
  InstantService,
} from 'src/instant/instant.service';
import { TransactionDto } from 'src/instant/dto/transaction-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('instant')
@UseGuards(new (AuthGuard('wallet_address'))())
export class InstantController {
  constructor(private instantService: InstantService) {}

  @Post()
  startSimulate(@Body() body: TransactionDto, @Request() req): Promise<InstantMethodResponse> {
    console.log(req.user, typeof req)
    return this.instantService.startSimulate(body);
  }
}
