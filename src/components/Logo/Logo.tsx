'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './Logo.module.css';

export const Logo = () => {
  const { t } = useTranslation();

  return (
    <span className={styles.logo}>
      <Image
        alt="Podcaster icon"
        className={styles.mark}
        height={40}
        priority
        src="/icon.svg"
        width={40}
      />
      {t('appName')}
      <span className={styles.dot} aria-hidden="true">
        .
      </span>
    </span>
  );
};
