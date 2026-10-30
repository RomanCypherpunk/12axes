import { describe, expect, it } from 'vitest';
import { paddleEnvironment, paddleTransactionFromSearch } from './paddle';

describe('paddleEnvironment', () => {
  it('token de teste fala com o sandbox, qualquer outro com a produção', () => {
    expect(paddleEnvironment('test_6b126494e7a0c0789ca36635642')).toBe('sandbox');
    expect(paddleEnvironment('live_abc')).toBe('production');
    expect(paddleEnvironment('')).toBe('production');
  });
});

describe('paddleTransactionFromSearch', () => {
  it('lê a transação que o servidor abriu', () => {
    expect(paddleTransactionFromSearch('?est=54.5&_ptxn=txn_01m66hdb2rreyh7xd6mjvm40yr&rep=28.7')).toBe('txn_01m66hdb2rreyh7xd6mjvm40yr');
  });

  it('sem o parâmetro, ou com qualquer coisa que não seja uma transação, devolve null', () => {
    expect(paddleTransactionFromSearch('')).toBeNull();
    expect(paddleTransactionFromSearch('?est=1')).toBeNull();
    expect(paddleTransactionFromSearch('?_ptxn=')).toBeNull();
    expect(paddleTransactionFromSearch('?_ptxn=pay_123')).toBeNull();
    expect(paddleTransactionFromSearch('?_ptxn=txn_<script>')).toBeNull();
    expect(paddleTransactionFromSearch('?_ptxn=txn_curto')).toBeNull();
  });
});
