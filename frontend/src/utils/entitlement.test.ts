import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { accessLink, accessTokenFromHash, canonicalResultLink, findRenewableToken, loadToken, removeToken, saveToken, tokenExpiresAt, vectorHash } from './entitlement';

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

  it('findRenewableToken devolve o acesso mais recente de OUTRO resultado', () => {
    const at = (issued: number, expires: number) => `${base64url(`v2|hash|pi_3Test|${issued}|${expires}`)}.assinatura`;
    const older = at(1000, 4_000_000_000);
    const newer = at(2000, 4_000_000_000);
    saveToken('hash-a', older);
    saveToken('hash-b', newer);
    saveToken('hash-novo', at(3000, 4_000_000_000));
    expect(findRenewableToken('hash-novo', localStorage, 1000)).toBe(newer);
    expect(findRenewableToken('hash-b', localStorage, 1000)).not.toBe(newer);
  });

  it('findRenewableToken ignora expirado, lixo e chaves de outro assunto', () => {
    localStorage.setItem('outra-coisa', tokenExpiringAt(4_000_000_000));
    saveToken('hash-a', tokenExpiringAt(2000));
    saveToken('hash-b', 'lixo');
    expect(findRenewableToken('hash-novo', localStorage, 3_000_000)).toBeNull();
    expect(findRenewableToken('hash-novo', null)).toBeNull();
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

describe('link de acesso guardado', () => {
  const token = `${base64url('v2|hash|123456|1000|4000000000')}.assinatura+/=`;

  it('põe o acesso no fragmento do endereço e o lê de volta', () => {
    const link = accessLink('https://12axes.vercel.app/results?est=92.3&rep=25.7', token);
    const url = new URL(link);
    expect(url.search).toBe('?est=92.3&rep=25.7');
    expect(url.hash.startsWith('#access=')).toBe(true);
    expect(accessTokenFromHash(url.hash)).toBe(token);
  });

  it('o acesso não vai para a parte do endereço que os servidores recebem', () => {
    const link = accessLink('https://12axes.vercel.app/results?est=1', token);
    expect(link.split('#')[0]).not.toContain(token);
  });

  it('substitui uma âncora que já existia', () => {
    const link = accessLink('https://12axes.vercel.app/results?est=1#bussola', token);
    expect(accessTokenFromHash(new URL(link).hash)).toBe(token);
    expect(link).not.toContain('#bussola');
  });

  it('sem acesso no fragmento, devolve null', () => {
    expect(accessTokenFromHash('')).toBeNull();
    expect(accessTokenFromHash('#bussola')).toBeNull();
    expect(accessTokenFromHash('#access=')).toBeNull();
  });
});

describe('canonicalResultLink', () => {
  const sorted = 'https://12axes.vercel.app/results?com=70&con=48&dip=71.3&eco=73&est=54.5&imi=45.5&int=28.7&lang=en&mor=53&paywall=1&pod=71.3&rel=30&religion=catholic&rep=28.7&tec=27';

  it('devolve os 12 valores na ordem de sempre, depois a religião, sem a marca de teste', () => {
    expect(canonicalResultLink(sorted, 'pt')).toBe(
      'https://12axes.vercel.app/results?est=54.5&rep=28.7&pod=71.3&imi=45.5&dip=71.3&int=28.7&eco=73&con=48&com=70&rel=30&mor=53&tec=27&religion=catholic'
    );
  });

  it('em inglês acrescenta o idioma no fim', () => {
    expect(canonicalResultLink(sorted, 'en').endsWith('&religion=catholic&lang=en')).toBe(true);
  });

  it('sem religião no endereço, não inventa uma', () => {
    const noReligion = 'https://12axes.vercel.app/results?tec=27&mor=53&rel=30&com=70&con=48&eco=73&int=28.7&dip=71.3&imi=45.5&pod=71.3&rep=28.7&est=54.5';
    expect(canonicalResultLink(noReligion, 'pt')).toBe(
      'https://12axes.vercel.app/results?est=54.5&rep=28.7&pod=71.3&imi=45.5&dip=71.3&int=28.7&eco=73&con=48&com=70&rel=30&mor=53&tec=27'
    );
  });

  it('descarta a volta do pagamento e a âncora', () => {
    const back = `${sorted}&_ptxn=txn_01m66hdb2rreyh7xd6mjvm40yr&pay=txn_01m66hdb2rreyh7xd6mjvm40yr#premium-eixos`;
    expect(canonicalResultLink(back, 'pt')).not.toMatch(/_ptxn|pay=|premium|paywall/);
  });

  it('sem os 12 valores (link curto, por exemplo), devolve o endereço como veio', () => {
    expect(canonicalResultLink('https://12axes.vercel.app/r?s=abc', 'pt')).toBe('https://12axes.vercel.app/r?s=abc');
  });

  it('com o acesso no fim, o link fica "o endereço de sempre" seguido do token', () => {
    const link = accessLink(canonicalResultLink(sorted, 'pt'), 'TOKEN');
    expect(link.endsWith('&religion=catholic#access=TOKEN')).toBe(true);
    expect(link.indexOf('est=')).toBeLessThan(link.indexOf('rep='));
  });
});
