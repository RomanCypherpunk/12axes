// Grafismo-assinatura da marca: 12 raios, 3 anéis tracejados e um perfil em radar.
const CENTER = 220;
const MAX_RADIUS = 193.6;
const RINGS = [63.9, 127.8, 193.6];
const PROFILE = [0.82, 0.55, 0.9, 0.42, 0.7, 0.62, 0.86, 0.36, 0.76, 0.5, 0.94, 0.6];

function point(index: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / 12 - Math.PI / 2;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
}

export function RoseOfAxes({ label }: { label: string }) {
  const vertices = PROFILE.map((value, index) => point(index, value * MAX_RADIUS));
  const polygon = vertices.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <svg className="e-rose" viewBox="0 0 440 440" role="img" aria-label={label}>
      {RINGS.map((radius) => (
        <circle key={radius} cx={CENTER} cy={CENTER} r={radius} fill="none" stroke="#3E5A4F" strokeWidth="1.5" strokeDasharray="4 8" />
      ))}
      {PROFILE.map((_, index) => {
        const [x, y] = point(index, MAX_RADIUS);
        return (
          <line key={index} x1={CENTER} y1={CENTER} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#F4F1E8" strokeOpacity=".35" strokeWidth="1.5" />
        );
      })}
      <polygon
        className="e-rose-shape"
        points={polygon}
        fill="#E7A9A4"
        fillOpacity=".22"
        stroke="#E7A9A4"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {vertices.map(([x, y], index) => (
        <circle key={index} cx={x.toFixed(1)} cy={y.toFixed(1)} r="5" fill="#E7A9A4" />
      ))}
      <circle cx={CENTER} cy={CENTER} r="5" fill="#F4F1E8" />
    </svg>
  );
}
