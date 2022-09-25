import { Controller, Get, Body, Post } from '@nestjs/common';
import {
  InstantMethodResponse,
  InstantService,
} from 'src/instant/service/instant/instant.service';
import { TransactionDto } from 'src/instant/dto/transaction-dto';
@Controller('instant')
export class InstantController {
  constructor(private instantService: InstantService) {}

  @Post()
  startSimulate(@Body() body: TransactionDto): Promise<InstantMethodResponse> {
    return this.instantService.startSimulate(body);
  }
}
