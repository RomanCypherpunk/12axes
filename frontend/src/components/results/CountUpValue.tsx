import { NUMBER_LOCALE } from '../../i18n';
import { useCountUp } from '../../hooks/useCountUp';

interface CountUpValueProps {
  value: number;
  decimals?: number;
  delayMs?: number;
  suffix?: string;
}

// Numero que sobe de 0 ate o valor quando entra em cena — a leitura do
// instrumento acontecendo, em vez de um resultado ja pronto na tela.
export function CountUpValue({ value, decimals = 1, delayMs = 0, suffix = '%' }: CountUpValueProps) {
  const { ref, text } = useCountUp(value, { decimals, delayMs });

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="count-up">
      {Number(text).toLocaleString(NUMBER_LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
