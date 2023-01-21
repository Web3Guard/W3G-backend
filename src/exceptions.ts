import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiLimitExceddedException extends HttpException {
  constructor(apiRateLimit: number) {
    super(`Api Limit Excedded. Quota for service is ${apiRateLimit} api calls` , HttpStatus.TOO_MANY_REQUESTS);
  }
}