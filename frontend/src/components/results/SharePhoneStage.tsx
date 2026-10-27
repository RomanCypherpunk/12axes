import { useEffect, useState, type CSSProperties, type Ref } from 'react';
import { t } from '../../i18n';
import { mixHex } from '../../utils/shareCard';

/** Cores do palco: degradê claro do fundo (de, meio, até) e o fundo da tela do celular (cor do cartão). */
export interface ShareStageColors {
  from: string;
  mid: string;
  to: string;
  screen: string;
}

type Preview = { status: 'idle' | 'loading' | 'error' } | { status: 'ready'; src: string };

/** Gera a imagem do cartão só quando o palco está perto de aparecer na tela, e de novo se `deps` mudar. */
export function useSharePreview(generate: () => Promise<string>, deps: unknown[]) {
  // Ref por função: o palco pode aparecer depois (a comparação só o mostra quando os dados chegam).
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState<Preview>({ status: 'idle' });

  useEffect(() => {
    if (!node || visible) {
      return undefined;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '700px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, visible]);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    let cancelled = false;
    setPreview({ status: 'loading' });
    generate()
      .then((src) => {
        if (!cancelled) {
          setPreview({ status: 'ready', src });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreview({ status: 'error' });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ...deps]);

  return { ref: setNode, status: preview.status, src: preview.status === 'ready' ? preview.src : null };
}

/** Cores claras do palco a partir da cor base e do pastel de uma categoria (e, na comparação, da segunda pessoa). */
export function stageColors(first: { base: string; bg: string }, second?: { base: string; bg: string }): ShareStageColors {
  const from = mixHex(first.bg, '#FFFFFF', 0.55);
  if (!second) {
    return { from, mid: first.bg, to: mixHex(first.base, first.bg, 0.34), screen: first.base };
  }
  const gradient = [first.base, mixHex(first.base, second.base, 2 / 3), mixHex(first.base, second.base, 1 / 3), second.base].join(', ');
  return {
    from,
    mid: mixHex(first.bg, second.bg, 0.5),
    to: mixHex(second.base, second.bg, 0.34),
    screen: `linear-gradient(160deg, ${gradient})`
  };
}

interface SharePhoneStageProps {
  id: string;
  title: string;
  colors: ShareStageColors;
  src: string | null;
  isSharing: boolean;
  onShare: () => void;
  sectionRef?: Ref<HTMLElement>;
}

/** Palco com o título, um iPhone 3D e o cartão inteiro à frente, sobre um degradê claro do espectro. */
export function SharePhoneStage({ id, title, colors, src, isSharing, onShare, sectionRef }: SharePhoneStageProps) {
  return (
    <section
      className="e-share-preview e-share-stage"
      id={id}
      ref={sectionRef}
      style={{ '--stage-from': colors.from, '--stage-mid': colors.mid, '--stage-to': colors.to, '--stage-screen': colors.screen } as CSSProperties}
      data-reveal
    >
      <h2>{title}</h2>
      <div className="e-share-pair">
        <button className="e-phone" type="button" onClick={onShare} disabled={isSharing || !src} aria-label={t.saveOrShare} tabIndex={-1}>
          <span className="e-phone-body">
            <span className="e-phone-edge" aria-hidden="true" />
            <span className="e-phone-edge" aria-hidden="true" />
            <span className="e-phone-edge" aria-hidden="true" />
            <span className="e-phone-edge" aria-hidden="true" />
            <i className="e-phone-btn is-action" aria-hidden="true" />
            <i className="e-phone-btn is-vol-up" aria-hidden="true" />
            <i className="e-phone-btn is-vol-down" aria-hidden="true" />
            <i className="e-phone-btn is-power" aria-hidden="true" />
            <span className="e-phone-screen">
              {src ? (
                <img src={src} alt="" width={1080} height={1920} draggable={false} />
              ) : (
                <span className="e-share-skeleton" role="status" aria-label={t.sharePreviewLoading} />
              )}
              <i className="e-phone-island" aria-hidden="true" />
              <i className="e-phone-glare" aria-hidden="true" />
            </span>
          </span>
        </button>
        <button className="e-share-flat" type="button" onClick={onShare} disabled={isSharing || !src} aria-label={t.saveOrShare}>
          {src ? (
            <img src={src} alt={t.sharePreviewAlt} width={1080} height={1920} draggable={false} />
          ) : (
            <span className="e-share-skeleton" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
