import type { ReactNode } from 'react';

import { Artwork } from '../Artwork/Artwork';
import { Card } from '../Card/Card';
import { OptionalLink } from '../OptionalLink/OptionalLink';
import styles from './SummaryCard.module.css';

type Props = {
  media: {
    src: string;
    alt: string;
  };
  title: ReactNode;
  caption?: ReactNode;
  href?: string;
};

export const SummaryCard = ({ media, title, caption, href }: Props) => (
  <OptionalLink href={href} className={styles.link}>
    <Card clickable={Boolean(href)} className={styles.card}>
      <Artwork src={media.src} alt={media.alt} shape="round" />
      <span className={styles.title}>
        <span className={styles.titleText}>{title}</span>
      </span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </Card>
  </OptionalLink>
);
