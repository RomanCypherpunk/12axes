import { useRef, useState, type FormEvent } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult } from '../../types/quiz';
import { cleanName, MAX_NAME_LENGTH, parseResultLink, peopleCompareUrl, RESULT_URL_KEYS, type ResultLinkProblem } from '../../utils/peopleCompare';
import type { Religion } from '../../utils/religion';
import { ArrowIcon } from '../editorial/primitives';

interface ComparePersonSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  religion?: Religion | null;
}

function PasteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3A4.5 4.5 0 0 0 11 19.4l1-1" />
    </svg>
  );
}

/** "Compare com outra pessoa": nome + link do resultado dela; abre /compare/people numa aba nova. */
export function ComparePersonSection({ axes, results, religion }: ComparePersonSectionProps) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  // As chaves do link (est, rep…) viram o nome do eixo na mensagem de erro.
  const axisNames = (keys: string[]): string =>
    keys.map((key) => t.homeAxes[axes[RESULT_URL_KEYS.indexOf(key as (typeof RESULT_URL_KEYS)[number])]?.id]?.label ?? key).join(', ');
  const messageFor = (problem: ResultLinkProblem): string | null => {
    if (problem.kind === 'missing') return t.peopleLinkMissing(axisNames(problem.keys));
    if (problem.kind === 'invalid') return t.peopleLinkInvalid(axisNames(problem.keys));
    return null;
  };

  // Valida e abre a comparação. Com `quiet`, campo vazio ou nome faltando não vira erro (colar sem nome ainda).
  const open = (rawLink: string, rawName: string, quiet = false): boolean => {
    const parsed = parseResultLink(rawLink);
    if (!parsed.ok) {
      setError(quiet && parsed.problem.kind === 'empty' ? null : messageFor(parsed.problem));
      if (!quiet || parsed.problem.kind !== 'empty') linkRef.current?.focus();
      return false;
    }
    if (!rawName.trim()) {
      setError(quiet ? null : t.peopleNameRequired);
      nameRef.current?.focus();
      return false;
    }
    setError(null);
    const you = axes.map((axis) => results.get(axis.id)?.leftPercent ?? 50);
    const url = peopleCompareUrl({
      names: [t.peopleYou, cleanName(rawName, t.peopleOther)],
      people: [
        { values: you, religion: religion ?? null },
        { values: parsed.values, religion: parsed.religion }
      ]
    });
    // Aba nova: o resultado desta página só existe na memória deste navegador. Sem "noopener" no
    // window.open (ele faria o retorno ser sempre null); o opener é cortado à mão. Se o navegador
    // bloquear o pop-up (colar demora a liberar a leitura), o link fica na tela em vez de trocar de aba.
    const tab = window.open(url, '_blank');
    if (tab) {
      tab.opener = null;
      setBlockedUrl(null);
    } else {
      setBlockedUrl(url);
    }
    return true;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    open(link, name);
  };

  const paste = async () => {
    let text: string;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      setError(t.peoplePasteBlocked);
      linkRef.current?.focus();
      return;
    }
    setLink(text.trim());
    open(text, name, true);
  };

  const canPaste = typeof navigator !== 'undefined' && typeof navigator.clipboard?.readText === 'function';

  return (
    <section className="e-panel e-ppl" id="comparar-pessoa" data-reveal>
      <div className="e-ppl-intro">
        <span className="e-ppl-duo" aria-hidden="true">
          <i />
          <i />
        </span>
        <h2>{t.peopleTitle}</h2>
        <p className="e-lead e-cmp-lead">{t.peopleLead}</p>
      </div>

      <div className="e-ppl-side">
        <form className="e-ppl-form" onSubmit={submit} noValidate>
          <label className="e-ppl-field">
            <span className="e-ppl-cap">{t.peopleNameCaption}</span>
            <span className="e-ppl-control">
              <UserIcon />
              <input
                ref={nameRef}
                type="text"
                aria-label={t.peopleNameLabel}
                placeholder={t.peopleNamePlaceholder}
                maxLength={MAX_NAME_LENGTH}
                autoComplete="off"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </span>
          </label>

          <label className="e-ppl-field">
            <span className="e-ppl-cap">{t.peopleUrlCaption}</span>
            <span className="e-ppl-control" data-invalid={error ? '' : undefined}>
              <LinkIcon />
              <input
                ref={linkRef}
                type="text"
                inputMode="url"
                aria-label={t.peopleUrlLabel}
                aria-invalid={error ? true : undefined}
                placeholder={t.peopleUrlPlaceholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={link}
                onChange={(event) => {
                  setLink(event.target.value);
                  setError(null);
                }}
              />
              {canPaste && (
                <button className="e-ppl-paste" type="button" onClick={paste}>
                  <PasteIcon /> {t.peoplePaste}
                </button>
              )}
            </span>
          </label>

          <button className="e-btn e-btn-primary e-ppl-submit" type="submit">
            {t.peopleCompare} <ArrowIcon />
          </button>
        </form>
        {blockedUrl && (
          <p className="e-cmp-empty e-ppl-note" role="status">
            {t.peopleBlocked}{' '}
            <a href={blockedUrl} target="_blank" rel="noopener">
              {t.peopleOpenLink}
            </a>
          </p>
        )}
        {error && (
          <p className="inline-error e-ppl-note" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
