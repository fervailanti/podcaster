import Image from 'next/image';
import styles from './PodcastArtwork.module.css';

type Props = {
  src: string;
  alt: string;
  size?: 'card' | 'sidebar';
  eager?: boolean;
};

export function PodcastArtwork({
  src,
  alt,
  size = 'card',
  eager = false,
}: Props) {
  return (
    <div className={`${styles.artwork} ${styles[size]}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          sizes={size === 'card' ? '(max-width: 640px) 160px, 200px' : '240px'}
          loading={eager ? 'eager' : 'lazy'}
          unoptimized
        />
      ) : (
        <span aria-hidden="true">♪</span>
      )}
    </div>
  );
}
