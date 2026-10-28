import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadToken, removeToken, saveToken, tokenExpiresAt, vectorHash } from './entitlement';

const base64url = (text: string) => btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const tokenExpiringAt = (seconds: number) => `${base64url(`v2|hash|pi_3Test|1000|${seconds}`)}.assinatura`;

// O ambiente dos testes é o Node, sem localStorage: um armazenamento em memória no lugar dele.
function memoryStorage(overrides: Partial<Storage> = {}): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    get length() {
      return data.size;
    },
    ...overrides
  } as Storage;
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('vectorHash', () => {
  it('é o mesmo hash do backend (fixture de EntitlementTokenTest)', async () => {
    expect(await vectorHash([65, 32.5, 50, 40, 30, 60, 70, 50, 45, 55, 35, 80])).toBe(
      '18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b'
    );
  });

  it('ruído abaixo de 1 casa decimal não muda o hash', async () => {
    const base = [65, 32.5, 50, 40, 30, 60, 70, 50, 45, 55, 35, 80];
    expect(await vectorHash(base.map((value) => value + 0.01))).toBe(await vectorHash(base));
  });
});

describe('tokenExpiresAt', () => {
  it('lê a expiração do token, em milissegundos', () => {
    expect(tokenExpiresAt(tokenExpiringAt(2_000_000))).toBe(2_000_000_000);
  });

  it('devolve null para qualquer coisa que não seja um token', () => {
    expect(tokenExpiresAt('lixo')).toBeNull();
    expect(tokenExpiresAt('')).toBeNull();
  });
});

describe('saveToken e loadToken', () => {
  it('guarda e devolve o token do resultado', () => {
    const token = tokenExpiringAt(4_000_000_000);
    saveToken('hash-a', token);
    expect(loadToken('hash-a', 1000)).toBe(token);
    expect(loadToken('hash-b', 1000)).toBeNull();
  });

  it('ignora (e apaga) token expirado', () => {
    saveToken('hash-a', tokenExpiringAt(2000));
    expect(loadToken('hash-a', 3_000_000)).toBeNull();
    expect(localStorage.getItem('12axes:entitlement:hash-a')).toBeNull();
  });

  it('removeToken tira o acesso', () => {
    saveToken('hash-a', tokenExpiringAt(4_000_000_000));
    removeToken('hash-a');
    expect(loadToken('hash-a', 1000)).toBeNull();
  });

  it('com o armazenamento indisponível não quebra', () => {
    const blocked = () => {
      throw new Error('bloqueado');
    };
    vi.stubGlobal('localStorage', memoryStorage({ getItem: blocked, setItem: blocked, removeItem: blocked }));
    expect(loadToken('hash-a')).toBeNull();
    expect(() => saveToken('hash-a', 'x')).not.toThrow();
  });
});
