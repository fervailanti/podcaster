import type { ReactNode } from 'react';

import styles from './Eyebrow.module.css';

type Props = {
  children: ReactNode;
};

export const Eyebrow = ({ children }: Props) => <span className={styles.eyebrow}>{children}</span>;
