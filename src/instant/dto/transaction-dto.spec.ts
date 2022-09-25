import { TransactionDto } from './transaction-dto';

describe('PostDto', () => {
  it('should be defined', () => {
    expect(new TransactionDto()).toBeDefined();
  });
  it('sample dto', () => {
    const body = {
      network_id: '1',
      from: '0xcdd37ada79f589c15bd4f8fd2083dc88e34a2af2',
      input:
        '0xa9059cbb000000000000000000000000ffa0bfba28c27aa808e672dfd0ec2d46ca03c43f0000000000000000000000000000000000000000000000000000000005d3722c',
      to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      gas: 8000000,
      gas_price: '0',
      value: '0',
    };

    expect(new TransactionDto(body)).toBeDefined();
  });
});
