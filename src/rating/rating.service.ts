import { HttpService } from '@nestjs/axios';
import { Injectable, Module } from '@nestjs/common';
import { ethers } from 'ethers';
import { firstValueFrom } from 'rxjs';

import solc from 'solc';

const ETHERSCAN_URL = 'https://api.etherscan.io/api';

interface SourceCodeResponse {
  SourceCode: string;
  ContractName: string;
  CompilerVersion: string;
}
interface EtherScanResponse {
  status: string;
  message: string;
  result: SourceCodeResponse[];
}

interface EtherScanVerifyResponse {
  status: string;
  message: string;
  result: string;
}

@Injectable()
export class RatingService {
  constructor(private readonly httpService: HttpService) {}

  async returnDocs(
    function_name: string,
    contract_address: string,
  ): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get<EtherScanResponse>(ETHERSCAN_URL, {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address: contract_address,
          apikey: 'E6WVF8WCEJQ3IH2T5XFEWBYVU57D9994MX',
        },
      }),
    );
    const output = await this.compileContracts(
      function_name,
      response.data.result[0],
    );
    return output;
  }

  async compileContracts(
    function_name: string,
    sourceCodes: SourceCodeResponse,
  ) {
    const solcSnapshot = await this.getSolcVersion(sourceCodes.CompilerVersion);
    const output = JSON.parse(
      sourceCodes.SourceCode.startsWith('{') &&
        sourceCodes.SourceCode.endsWith('}')
        ? solcSnapshot.compile(sourceCodes.SourceCode.slice(1, -1))
        : solcSnapshot.compile(
            JSON.stringify({
              language: 'Solidity',
              sources: {
                'main.sol': {
                  content: sourceCodes.SourceCode,
                },
              },
              settings: {
                outputSelection: {
                  '*': {
                    '*': ['*'],
                  },
                },
              },
            }),
          ),
    );
    const contractDetails = {};
    for (const key in output.contracts) {
      for (const contract in output.contracts[key]) {
        contractDetails[contract] = output.contracts[key][contract];
      }
    }

    const doc = {};
    doc[function_name] = { user_doc: {}, dev_doc: {} };
    for (const key in contractDetails) {
      const user_doc = contractDetails[key]['userdoc'];
      const dev_doc = contractDetails[key]['devdoc'];

      if (user_doc.hasOwnProperty('notice'))
        doc[function_name]['user_doc'].contract = user_doc['notice'];

      if (dev_doc.hasOwnProperty('notice'))
        doc[function_name]['dev_doc'].contract = dev_doc['method'];

      if (Object.keys(user_doc['methods']).length != 0) {
        if (user_doc['methods'].hasOwnProperty(function_name)) {
          doc[function_name]['user_doc'].function =
            user_doc['methods'][function_name];
        }
      }

      if (Object.keys(dev_doc['methods']).length != 0) {
        if (dev_doc['methods'].hasOwnProperty(function_name))
          doc[function_name]['dev_doc'].fucntion =
            dev_doc['methods'][function_name];
      }
      // doc[key] = contractDetails[key]['devdoc'];
    }
    return doc;
  }

  async getSolcVersion(version: string): Promise<any> {
    return new Promise((resolve, reject) => {
      solc.loadRemoteVersion(version, (err: any, solcSnapshot: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(solcSnapshot);
        }
      });
    });
  }

  // async checkVerification()
  // {
  //   //var url = https://api.etherscan.io/api?module=account&action=balance&address=https://api.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&tag=latest&apikey=E6WVF8WCEJQ3IH2T5XFEWBYVU57D9994MX
  // }

  async getAddress(contract_address: string): Promise<any> {
    const quick_node_url = process.env.QUICK_NODE_ENDPOINT;
    const provider = new ethers.providers.JsonRpcProvider(quick_node_url);
    const name = await provider.lookupAddress(contract_address);
    return name;
  }

  async checkVerification(contract_address: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get<EtherScanVerifyResponse>(ETHERSCAN_URL, {
        params: {
          module: 'contract',
          action: 'getabi',
          address: contract_address,
          apikey: 'E6WVF8WCEJQ3IH2T5XFEWBYVU57D9994MX',
        },
      }),
    );
    return response.data;
  }
}
