import { t } from '../../i18n';
import type { FullValue } from '../../types/quiz';
import { assetUrl, retryLocalAsset } from '../../utils/assetUrl';
import type { Religion } from '../../utils/religion';
import { FULL_VALUE_COINS } from './fullValueCoins';
import { ValueCoin } from './ValueCoin';

/** Só http(s) vira link: a fonte vem do catálogo, mas um endereço estranho nunca deve ser clicável. */
export function safeSourceUrl(url: string): string | null {
  return /^https?:\/\//i.test(url) ? url : null;
}

// Nome de arquivo simples: nada de pastas nem "..".
const SAFE_FILE = /^[\w][\w.-]*$/;

interface CoinProps {
  value: FullValue;
  size?: number;
  /** Religião do usuário: vira o símbolo da teocracia (padrão: a cruz do polo Religioso). */
  religion?: Religion | null;
}

/**
 * Moeda redonda de um valor declarado: o ícone do valor (fullValueCoins.tsx) na cor do espectro do usuário, como nas moedas dos
 * valores derivados. Sem ícone próprio, mas com imagem de fonte no catálogo, a imagem aparece como veio (recortada no círculo,
 * sem recolorir); sem nenhum dos dois, círculo com a inicial do valor.
 */
export function FullValueCoin({ value, size = 56, religion }: CoinProps) {
  const file = value.icon?.file;
  if (!FULL_VALUE_COINS[value.valueId] && file && SAFE_FILE.test(file)) {
    return (
      <span className="e-vcoin-img" style={{ width: size, height: size }}>
        <img
          src={assetUrl(`/values/${value.categoryId}/${file}`)}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={retryLocalAsset}
        />
      </span>
    );
  }
  return <ValueCoin valueId={`fv:${value.valueId}`} name={value.name} size={size} religion={religion} />;
}

/** Conteúdo da ficha de um valor declarado: nome, descrição e, quando há imagem, autor, licença e a fonte original. */
export function FullValueDetail({ value, religion }: { value: FullValue; religion?: Religion | null }) {
  const { icon } = value;
  const source = icon ? safeSourceUrl(icon.sourceUrl) : null;
  return (
    <div className="e-value-sheet">
      <FullValueCoin value={value} size={120} religion={religion} />
      <span className="e-dim">{value.categoryLabel}</span>
      <h3 id="value-sheet-title">{value.name}</h3>
      {value.neutral && <span className="e-tag e-tag-cat">{t.valuesNeutralTag}</span>}
      <p>{value.description}</p>
      {icon && (
        <div className="e-value-source">
          <span>
            {t.valuesSourceAuthor}: {icon.author} · {t.valuesSourceLicense}: {icon.license}
            {icon.modified ? ` · ${t.valuesSourceModified}` : ''}
          </span>
          {source && (
            <a className="e-btn e-btn-ghost e-btn-sm" href={source} target="_blank" rel="noopener noreferrer">
              {t.valuesSourceButton}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
