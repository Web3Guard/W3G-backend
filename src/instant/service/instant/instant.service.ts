import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TransactionDto } from 'src/instant/dto/transaction-dto';

interface BalanceDiff {
  address: string;
  original: string;
  dirty: string;
  is_miner: boolean;
}

interface StateDiff {
  dirty: any;
  original: any;
  raw: any;
  soltype: {
    name: string;
    type: string;
    storage_location: string;
  };
}

interface TransactionInfo {
  balance_diff: BalanceDiff[];
  state_diff: StateDiff[];
}

export interface InstantMethodResponse {
  balances: {
    address: string;
    current: string;
    future: string;
  }[];
  states: {
    name: string;
    type: string;
    current: any;
    future: any;
  }[];
}

@Injectable()
export class InstantService {
  constructor(private readonly httpService: HttpService) {}

  async startSimulate(body: TransactionDto): Promise<InstantMethodResponse> {
    const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } =
      process.env;
    const SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate/`;

    const opts = {
      headers: {
        'X-Access-Key': TENDERLY_ACCESS_KEY as string,
      },
    };

    const resp = await firstValueFrom(
      this.httpService.post(SIMULATE_URL, body, opts),
    );
    const responseData: InstantMethodResponse = {
      balances: [],
      states: [],
    };
    const transactionInfo = resp.data.transaction
      .transaction_info as TransactionInfo;

    responseData.balances = transactionInfo.balance_diff
      .filter((balanceDiff) => !balanceDiff.is_miner)
      .map((balanceDiff) => ({
        address: balanceDiff.address,
        current: balanceDiff.original,
        future: balanceDiff.dirty,
      }));
    
    if(transactionInfo.state_diff)
    responseData.states = transactionInfo.state_diff.map((stateDiff) => ({
      name: (stateDiff.soltype)?stateDiff.soltype.name:null,
      type: (stateDiff.soltype)?stateDiff.soltype.type:null,
      current: stateDiff.original,
      future: stateDiff.dirty,
    }));
    return responseData;
  }
}
