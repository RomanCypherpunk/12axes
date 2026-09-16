interface DistantCardProps {
  name: string;
  caption: string;
  compatibility: number;
}

// Card dos opostos: menor que os de afinidade porque e informacao secundaria,
// e em vermelho porque o dado e distancia.
export function DistantCard({ name, caption, compatibility }: DistantCardProps) {
  const pct = Math.max(0, Math.min(100, compatibility));

  return (
    <article className="distant-card">
      <div className="distant-card-text">
        <h4>{name}</h4>
        {caption && <p>{caption}</p>}
      </div>
      <span className="distant-card-score">{pct.toFixed(0)}%</span>
    </article>
  );
}
