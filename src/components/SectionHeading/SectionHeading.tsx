import type { ReactNode } from 'react';

import { Eyebrow } from '../Eyebrow/Eyebrow';
import styles from './SectionHeading.module.css';

type Props = {
  caption?: ReactNode;
  className?: string;
  eyebrow?: ReactNode;
  id?: string;
  title: ReactNode;
};

export const SectionHeading = ({ caption, className, eyebrow, id, title }: Props) => (
  <header className={`${styles.heading} ${className ?? ''}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h1 id={id} className={styles.title}>
      {title}
    </h1>
    {caption && <div className={styles.caption}>{caption}</div>}
  </header>
);
