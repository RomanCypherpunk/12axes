import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';
import type { AxisAgreement } from '../../utils/agreement';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';

const LONG_NAME = 14;

function futTier(rating: number, special: boolean): string {
  if (special) return 'fut-special';
  if (rating >= 85) return 'fut-gold';
  if (rating >= 70) return 'fut-silver';
  return 'fut-bronze';
}

// Nome curto como no Ultimate Team: nomes longos viram só o sobrenome.
function cardName(name: string): string {
  if (name.length <= LONG_NAME) return name;
  const words = name.split(' ');
  return words[words.length - 1];
}

interface FutCardProps {
  match: PersonalityMatch;
  size?: 'lg' | 'sm';
  stats?: AxisAgreement[];
  special?: boolean;
  onOpen?: () => void;
}

// Carta no estilo Ultimate Team: nota = compatibilidade, posição = área de atuação.
export function FutCard({ match, size = 'sm', stats = [], special = false, onOpen }: FutCardProps) {
  const rating = Math.round(match.compatibility);
  const className = `fut fut-${size} ${futTier(rating, special)}`;
  const body = (
    <>
      <span className="fut-ovr">
        {rating}
        <small>%</small>
      </span>
      <span className="fut-pos">{t.futPositions[match.category]}</span>
      <SafeImg
        className="fut-face"
        src={resolvePersonalityImageSrc(match.imagePath)}
        alt={t.portraitAlt(match.name)}
        fallback={personalityInitials(match.name)}
      />
      <span className="fut-name">{cardName(match.name)}</span>
      {stats.length > 0 && (
        <ul className="fut-stats">
          {stats.map((stat) => (
            <li key={stat.axisId} title={stat.label}>
              <b>{stat.value}</b> {stat.short}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  // O recorte (clip-path) cortaria a sombra da própria carta, então ela fica no invólucro.
  return (
    <div className="fut-hold">
      {onOpen ? (
        <button type="button" className={className} onClick={onOpen} aria-label={t.futOpenAria(match.name, rating)}>
          {body}
        </button>
      ) : (
        <div className={className}>{body}</div>
      )}
    </div>
  );
}
