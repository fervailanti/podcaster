import Image from 'next/image';
import type { ReactNode } from 'react';

import styles from './Artwork.module.css';

type Props = {
  src: string;
  alt: string;
  shape?: 'round' | 'square';
  fallback?: ReactNode;
  eager?: boolean;
};

export const Artwork = ({ src, alt, shape = 'square', fallback = '♪', eager = false }: Props) => {
  return (
    <div className={`${styles.artwork} ${styles[shape]}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          sizes={shape === 'round' ? '(max-width: 640px) 160px, 200px' : '240px'}
          loading={eager ? 'eager' : 'lazy'}
          unoptimized
        />
      ) : (
        <span role={alt ? 'img' : undefined} aria-hidden={!alt} aria-label={alt || undefined}>
          {fallback}
        </span>
      )}
    </div>
  );
};
