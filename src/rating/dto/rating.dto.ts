import { IsString } from 'class-validator';

export class RatingDto {
  @IsString()
  contract: string;
}
