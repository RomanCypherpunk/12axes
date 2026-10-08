import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { religionAllows, religionVisibility } from '../scripts/profile-match.mjs';
import { profileReligion } from '../scripts/pole-icons.mjs';

const readData = (file) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../backend/src/main/resources/data/${file}`, import.meta.url)), 'utf8'));

describe('religionAllows (porte de ReligionFilter.java)', () => {
  it('mostra perfis sem religião para qualquer preferência', () => {
    expect(religionAllows([], 'catholic')).toBe(true);
    expect(religionAllows(undefined, null)).toBe(true);
  });

  it('esconde o perfil ligado só a outra religião selecionável', () => {
    expect(religionAllows(['islam'], 'catholic')).toBe(false);
    expect(religionAllows(['catholic'], 'catholic')).toBe(true);
    expect(religionAllows(['protestant'], 'catholic')).toBe(false);
    expect(religionAllows(['protestant', 'catholic'], 'catholic')).toBe(true);
  });

  it('hinduísmo é uma religião selecionável: esconde perfis só de outras e aparece para quem o escolheu', () => {
    expect(religionAllows(['hinduism'], 'hinduism')).toBe(true);
    expect(religionAllows(['hinduism'], 'catholic')).toBe(false);
    expect(religionAllows(['islam'], 'hinduism')).toBe(false);
    expect(religionAllows(['hinduism', 'only'], 'hinduism')).toBe(true);
    expect(religionAllows(['hinduism', 'only'], null)).toBe(false);
    expect(religionAllows(['catholic', 'protestant', 'orthodox', 'judaism', 'islam', 'buddhism', 'hinduism'], 'hinduism')).toBe(true);
  });

  it('mantém perfis só com "other" para qualquer preferência', () => {
    expect(religionAllows(['other'], 'catholic')).toBe(true);
    expect(religionAllows(['other'], null)).toBe(true);
  });

  it('"only" aparece só para quem escolheu uma das religiões listadas', () => {
    expect(religionAllows(['judaism', 'only'], 'judaism')).toBe(true);
    expect(religionAllows(['judaism', 'only'], 'catholic')).toBe(false);
    expect(religionAllows(['judaism', 'only'], null)).toBe(false);
  });
});

it('"other" + "only" (xintoísmo) some para quem escolheu religião e aparece para quem não escolheu', () => {
  expect(religionAllows(['other', 'only'], 'catholic')).toBe(false);
  expect(religionAllows(['other', 'only'], 'buddhism')).toBe(false);
  expect(religionAllows(['other', 'only'], null)).toBe(true);
});

describe('religionVisibility (página do perfil)', () => {
  it('usa a religião do próprio perfil como preferência', () => {
    const visible = religionVisibility({ religions: ['protestant'] });
    expect(visible({ religions: ['buddhism', 'only'] })).toBe(false);
    expect(visible({ religions: ['islam'] })).toBe(false);
    expect(visible({ religions: ['catholic'] })).toBe(false);
    expect(visible({ religions: ['protestant'] })).toBe(true);
    expect(visible({ religions: [] })).toBe(true);
  });

  it('perfil sem religião selecionável não vê perfis "only"', () => {
    const visible = religionVisibility({ religions: [] });
    expect(visible({ religions: ['judaism', 'only'] })).toBe(false);
    expect(visible({ religions: ['islam'] })).toBe(true);
  });

  it('com mais de uma religião basta servir a uma delas', () => {
    const visible = religionVisibility({ religions: ['catholic', 'judaism'] });
    expect(visible({ religions: ['judaism', 'only'] })).toBe(true);
    expect(visible({ religions: ['islam', 'only'] })).toBe(false);
  });

  it('Nick Fuentes não vê a Teocracia Judaica nem o Dalai Lama', () => {
    const fuentes = readData('personalities.json').find((p) => p.id === 'nick-fuentes');
    const visible = religionVisibility(fuentes);
    const ideology = readData('ideologies.json').find((i) => i.id === 'teocracia-judaica');
    const dalaiLama = readData('personalities.json').find((p) => p.id === 'dalai-lama');
    expect(visible(ideology)).toBe(false);
    expect(visible(dalaiLama)).toBe(false);
  });
});

describe('dados: hinduísmo', () => {
  it('ideologias neutras (as seis religiões) também listam o hinduísmo', () => {
    const six = ['catholic', 'protestant', 'orthodox', 'judaism', 'islam', 'buddhism'];
    const neutral = readData('ideologies.json').filter((i) => six.every((r) => i.religions.includes(r)));
    expect(neutral.length).toBeGreaterThan(0);
    for (const ideology of neutral) {
      expect(ideology.religions, ideology.id).toContain('hinduism');
    }
  });

  it('Gandhi é marcado como hinduísta', () => {
    const gandhi = readData('personalities.json').find((p) => p.id === 'mahatma-gandhi');
    expect(gandhi.religions).toEqual(['hinduism']);
  });
});

describe('profileReligion (ícone do polo Religioso na página do perfil)', () => {
  it('usa a única religião selecionável marcada', () => {
    expect(profileReligion(['islam'])).toBe('islam');
    expect(profileReligion(['orthodox'])).toBe('orthodox');
    expect(profileReligion(['judaism', 'only'])).toBe('judaism');
    expect(profileReligion(['hinduism'])).toBe('hinduism');
  });

  it('mantém a cruz padrão sem religião, só com "other" ou com religiões diferentes', () => {
    expect(profileReligion([])).toBeNull();
    expect(profileReligion(undefined)).toBeNull();
    expect(profileReligion(['other'])).toBeNull();
    expect(profileReligion(['catholic', 'islam'])).toBeNull();
    expect(profileReligion(['catholic', 'protestant'])).toBeNull();
  });
});
