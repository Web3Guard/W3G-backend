import { Controller, Get, Param, Post } from '@nestjs/common';
import { RatingService } from 'src/rating/rating.service';
const ethers = require('ethers');

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get('/ratingDocs/:function_name/:contract_address')
  checkContract(@Param() params): any {
    return this.ratingService.returnDocs(
      params.function_name,
      params.contract_address,
    );
  }

  @Get('/ensName/:contract_address')
  getAddress(@Param() params): any {
    return this.ratingService.getAddress(params.contract_address);
  }

  @Get('/verify/:contract_address')
  checkVerification(@Param() params): any {
    return this.ratingService.checkVerification(params.contract_address);
  }
}
