type AxisIconProps = {
  id: string;
  className?: string;
};

type PoleIconProps = {
  axisId: string;
  side: 'left' | 'right';
  className?: string;
};

const axisIcons: Record<string, JSX.Element> = {
  estrutura: (
    <>
      <path d="M4 10h16" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M3 18h18" />
      <path d="m12 4 8 4H4l8-4Z" />
    </>
  ),
  representacao: (
    <>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3 20a5 5 0 0 1 10 0" />
      <path d="M11 20a5 5 0 0 1 10 0" />
    </>
  ),
  poder: (
    <>
      <path d="M12 3 5 6v5c0 4.2 2.7 7.9 7 10 4.3-2.1 7-5.8 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  imigracao: (
    <>
      <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3 20a5 5 0 0 1 10 0" />
      <path d="M14 8h6" />
      <path d="m17 5 3 3-3 3" />
      <path d="M15 16h6" />
      <path d="m18 13 3 3-3 3" />
    </>
  ),
  diplomacia: (
    <>
      <path d="M6 19c6-2 10-6 12-13" />
      <path d="M7 8c3 1 5 3 6 6" />
      <path d="M5 13c4 0 7 1 10 4" />
      <path d="M18 6c-3-1-6-1-9 1" />
    </>
  ),
  intervencao: (
    <>
      <path d="M7 12h10" />
      <path d="m13 8 4 4-4 4" />
      <path d="M5 5v14" />
      <path d="M19 5v14" />
    </>
  ),
  economia: (
    <>
      <path d="M4 18h16" />
      <path d="M7 18v-5" />
      <path d="M12 18V8" />
      <path d="M17 18v-8" />
      <path d="m6 11 6-6 6 4" />
    </>
  ),
  controle: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
      <path d="M9 5v4" />
      <path d="M15 10v4" />
      <path d="M11 15v4" />
    </>
  ),
  comercio: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21" />
      <path d="M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9" />
    </>
  ),
  religiao: (
    <>
      <path d="M12 3v18" />
      <path d="M7 8h10" />
      <path d="M6 20h12" />
    </>
  ),
  moral: (
    <>
      <path d="M20 8c0 6-8 11-8 11S4 14 4 8a4 4 0 0 1 7-2.7A4 4 0 0 1 20 8Z" />
    </>
  ),
  tecnologia: (
    <>
      <path d="M8 8h8v8H8z" />
      <path d="M4 10h4" />
      <path d="M4 14h4" />
      <path d="M16 10h4" />
      <path d="M16 14h4" />
      <path d="M10 4v4" />
      <path d="M14 4v4" />
      <path d="M10 16v4" />
      <path d="M14 16v4" />
    </>
  )
};

const poleIcons: Record<string, { left: JSX.Element; right: JSX.Element }> = {
  estrutura: {
    left: axisIcons.estrutura,
    right: (
      <>
        <path d="M6 8h12v12H6z" />
        <path d="M9 8V5h6v3" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    )
  },
  representacao: {
    left: axisIcons.representacao,
    right: (
      <>
        <path d="m4 9 4 3 4-7 4 7 4-3-2 10H6L4 9Z" />
        <path d="M8 19h8" />
      </>
    )
  },
  poder: {
    left: axisIcons.poder,
    right: (
      <>
        <path d="M12 3v18" />
        <path d="M6 9h12" />
        <path d="M8 21h8" />
        <path d="M5 13c1.5 2 4.5 2 6 0" />
        <path d="M13 13c1.5 2 4.5 2 6 0" />
      </>
    )
  },
  imigracao: {
    left: (
      <>
        <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M2 19a5 5 0 0 1 10 0" />
        <path d="M15 5h5" />
        <path d="M15 10h5" />
        <path d="M15 15h5" />
      </>
    ),
    right: axisIcons.imigracao
  },
  diplomacia: {
    left: (
      <>
        <path d="M5 20V4" />
        <path d="M5 5h11l-2 4 2 4H5" />
      </>
    ),
    right: axisIcons.diplomacia
  },
  intervencao: {
    left: (
      <>
        <path d="M7 12h10" />
        <path d="m10 8-4 4 4 4" />
        <path d="M18 5v14" />
      </>
    ),
    right: (
      <>
        <path d="M6 20V4" />
        <path d="M6 5h11l-2 4 2 4H6" />
        <path d="M4 20h8" />
      </>
    )
  },
  economia: {
    left: (
      <>
        <path d="M5 11h14" />
        <path d="M7 11v8" />
        <path d="M17 11v8" />
        <path d="M12 5v14" />
        <path d="M4 19h16" />
      </>
    ),
    right: (
      <>
        <path d="M12 3v18" />
        <path d="M17 7.5C16 5.8 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.5S9 12 12 12s4.5 1.2 4.5 3.5S14.8 19 12 19c-2.3 0-4-.8-5-2.5" />
      </>
    )
  },
  controle: {
    left: axisIcons.controle,
    right: (
      <>
        <path d="M12 3v18" />
        <path d="M17 7.5C16 5.8 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.5S9 12 12 12s4.5 1.2 4.5 3.5S14.8 19 12 19c-2.3 0-4-.8-5-2.5" />
      </>
    )
  },
  comercio: {
    left: axisIcons.poder,
    right: axisIcons.comercio
  },
  religiao: {
    left: (
      <>
        <path d="M12 4v16" />
        <path d="M4 12h16" />
        <path d="M6 18 18 6" />
      </>
    ),
    right: axisIcons.religiao
  },
  moral: {
    left: axisIcons.moral,
    right: (
      <>
        <path d="M7 4h10" />
        <path d="M8 20h8" />
        <path d="M9 4c0 5 6 5 6 10 0 2-1.3 4-3 6-1.7-2-3-4-3-6 0-5 6-5 6-10" />
      </>
    )
  },
  tecnologia: {
    left: axisIcons.tecnologia,
    right: (
      <>
        <path d="M5 19c8 0 13-5 14-14-7 1-13 5-14 14Z" />
        <path d="M5 19c4-5 8-8 14-14" />
      </>
    )
  }
};

export function AxisIcon({ id, className = 'axis-symbol' }: AxisIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {axisIcons[id] ?? axisIcons.estrutura}
    </svg>
  );
}

export function PoleIcon({ axisId, side, className = 'axis-symbol' }: PoleIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {(poleIcons[axisId] ?? poleIcons.estrutura)[side]}
    </svg>
  );
}
