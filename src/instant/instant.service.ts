import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TransactionDto } from 'src/instant/dto/transaction-dto';
const sateek = require('sateek')();
const SUPPORTED_CHAINS = {
  1: 'Ethereum Mainnet',
  137: 'Polygon Mainnet',
};

const CHAINID_EXPLORER_MAP = {
  1: 'https://etherscan.io',
  137: 'https://polygonscan.com/',
};
const SUPPORTED_TENDERLY_PREFIX = ['eth'];
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

interface ContractDetails {
  index: number;
  contract: string;
  network: string;
}

interface StateInfo {
  soltype: any;
  original: any;
  dirty: any;
  raw: any;
}

interface AddressChange {
  participant: string;
  changes: string | bigint;
}

interface IndividualStateResponse {
  stateName: string;
  stateType: string;
  participant: AddressChange[];
}

export interface InstantMethodResponse {
  stateChanges: IndividualStateResponse[];
  functionInfo: any;
}

@Injectable()
export class InstantService {
  constructor(private readonly httpService: HttpService) {}

  async startSimulate(body: TransactionDto): Promise<any> {
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
    // return resp.data;
    // Get details of contracts being called (Not used ATM)
    const contractIds = resp.data.transaction.contract_ids;
    const contractDetails: ContractDetails[] =
      this.simplifyContrcts(contractIds);
    // Get the function being called
    const functionDetails = resp.data.transaction.transaction_info;
    const stateChangesList: StateInfo[] = functionDetails.state_diff;
    const stateChanges: IndividualStateResponse[] = [];
    for (let i = 0; i < stateChangesList.length; i++) {
      const stateChange: IndividualStateResponse = this.getStateChanges(
        stateChangesList[i],
      );
      stateChanges.push(stateChange);
    }
    const response: InstantMethodResponse = {
      stateChanges: [],
      functionInfo: functionDetails.method,
    };
    response.stateChanges = stateChanges;
    return response;
    // const responseData: InstantMethodResponse = {
    //   balances: [],
    //   states: [],
    // };
    // const transactionInfo = resp.data.transaction
    //   .transaction_info as TransactionInfo;

    // responseData.balances = transactionInfo.balance_diff
    //   .filter((balanceDiff) => !balanceDiff.is_miner)
    //   .map((balanceDiff) => ({
    //     address: balanceDiff.address,
    //     current: balanceDiff.original,
    //     future: balanceDiff.dirty,
    //   }));

    // if (transactionInfo.state_diff)
    //   responseData.states = transactionInfo.state_diff.map((stateDiff) => ({
    //     name: stateDiff.soltype ? stateDiff.soltype.name : null,
    //     type: stateDiff.soltype ? stateDiff.soltype.type : null,
    //     current: stateDiff.original,
    //     future: stateDiff.dirty,
    //   }));
    // return responseData;
  }

  // Helper functions
  simplifyContrcts(contractInfo: string[]): ContractDetails[] {
    const result: ContractDetails[] = [];
    for (let i = 0; i < contractInfo.length; i++) {
      if (
        contractInfo[i].split(':').length == 3 &&
        SUPPORTED_TENDERLY_PREFIX.includes(contractInfo[i].split(':')[0])
      ) {
        const element: ContractDetails = {
          index: i,
          contract: `${
            CHAINID_EXPLORER_MAP[contractInfo[i].split(':')[1]]
          }/address/${contractInfo[i].split(':')[2]}`,
          network: SUPPORTED_CHAINS[contractInfo[i].split(':')[1]],
        };
        result.push(element);
      }
    }

    return result;
  }

  getStateChanges(data: StateInfo): IndividualStateResponse {
    const res: IndividualStateResponse = {
      stateName: '',
      stateType: '',
      participant: [],
    };
    res['stateName'] = data && data.soltype && data.soltype.name;
    res['stateType'] = data && data.soltype && data.soltype.type;
    res['participant'] = [];
    const originalStateAddresses: string[] =
      data && data.original ? Object.keys(data.original) : [];
    for (let i = 0; i < originalStateAddresses.length; i++) {
      const participantDetail: AddressChange = {
        participant: '',
        changes: '',
      };
      participantDetail.participant = originalStateAddresses[i];
      const originalState =
        data && data.original && data.original[originalStateAddresses[i]];
      const finalState =
        data && data.dirty && data.dirty[originalStateAddresses[i]];
      (participantDetail.changes = `State changed from ${JSON.stringify(
        originalState,
      )} to  ${JSON.stringify(finalState)}`),
        res.participant.push(participantDetail);
    }
    return res;
  }
}

// name of function
// state changes
