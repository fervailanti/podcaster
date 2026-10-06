'use client';

import { useTranslation } from 'react-i18next';

import styles from './Spinner.module.css';

export const Spinner = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation();
  return (
    <span className={styles.status} role="status" aria-label={loading ? t('loading') : undefined}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </span>
  );
};
