import type { ReactNode } from 'react';

import styles from './EmptyState.module.css';

type Props = {
  icon?: ReactNode;
  text: string;
};

export const EmptyState = ({ icon, text }: Props) => (
  <p className={styles.emptyState}>
    {icon && (
      <span className={styles.emptyIcon} aria-hidden="true">
        {icon}
      </span>
    )}
    {text}
  </p>
);
