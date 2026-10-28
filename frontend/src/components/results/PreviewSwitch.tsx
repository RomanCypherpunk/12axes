interface PreviewSwitchProps {
  value: 'paid' | 'free';
  onChange: (value: 'paid' | 'free') => void;
}

/**
 * SÓ EM DESENVOLVIMENTO (PREMIUM_DEV_OPEN): alterna a página entre a versão paga e a grátis, para ajustar o layout dos
 * dois lados sem pagar. Não existe no site publicado, porque a variável só vive no .env.local.
 */
export function PreviewSwitch({ value, onChange }: PreviewSwitchProps) {
  const pick = (next: 'paid' | 'free') => {
    const url = new URL(window.location.href);
    if (next === 'free') url.searchParams.set('preview', 'free');
    else url.searchParams.delete('preview');
    window.history.replaceState(null, '', url.toString());
    onChange(next);
  };
  return (
    <div className="e-dev-switch" role="group" aria-label="Pré-visualização (só em desenvolvimento)">
      <span>Pré-visualização</span>
      <button type="button" className={value === 'free' ? 'is-on' : undefined} onClick={() => pick('free')}>
        Grátis
      </button>
      <button type="button" className={value === 'paid' ? 'is-on' : undefined} onClick={() => pick('paid')}>
        Pago
      </button>
    </div>
  );
}
