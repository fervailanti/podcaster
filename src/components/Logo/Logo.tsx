'use client';

import { useTranslation } from 'react-i18next';

import styles from './Logo.module.css';

export const Logo = () => {
  const { t } = useTranslation();

  return (
    <span className={styles.logo}>
      <span className={styles.mark} aria-hidden="true">
        ◉
      </span>
      {t('appName')}
      <span className={styles.dot} aria-hidden="true">
        .
      </span>
    </span>
  );
};
