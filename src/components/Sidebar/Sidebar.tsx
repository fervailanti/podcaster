import type { ReactNode } from 'react';

import { Artwork } from '../Artwork/Artwork';
import { Card } from '../Card/Card';
import { Eyebrow } from '../Eyebrow/Eyebrow';
import { OptionalLink } from '../OptionalLink/OptionalLink';
import styles from './Sidebar.module.css';

type Props = {
  media: {
    src: string;
    alt: string;
  };
  title: ReactNode;
  subtitle?: ReactNode;
  body?: string;
  eyebrow?: ReactNode;
  titleHref?: string;
  mediaHref?: string;
};

export const Sidebar = ({ media, title, subtitle, body, eyebrow, titleHref, mediaHref }: Props) => (
  <Card as="aside" className={styles.sidebar}>
    <OptionalLink href={mediaHref}>
      <div className={styles.media}>
        <Artwork src={media.src} alt={media.alt} shape="square" eager />
      </div>
    </OptionalLink>
    <div className={styles.details}>
      <OptionalLink href={titleHref}>
        <span className={`${styles.title} ${titleHref ? styles.titleLink : ''}`}>{title}</span>
      </OptionalLink>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
    {body && (
      <div className={styles.body}>
        {eyebrow && (
          <h2>
            <Eyebrow>{eyebrow}</Eyebrow>
          </h2>
        )}
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    )}
  </Card>
);
