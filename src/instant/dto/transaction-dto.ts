export class TransactionDto {
  network_id: string;
  from: string;
  input: string;
  to: string;
  gas: number;
  gas_price: string;
  value: string;
}
