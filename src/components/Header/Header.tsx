'use client';

import { useTranslation } from 'react-i18next';

import { NavigationLink, useNavigation } from '@/navigation';

import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { Logo } from '../Logo/Logo';
import { Spinner } from '../Spinner/Spinner';
import styles from './Header.module.css';

export const Header = () => {
  const { t } = useTranslation();
  const { pending } = useNavigation();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavigationLink href="/" className={styles.brand} aria-label={t('backToDiscover')}>
          <Logo />
        </NavigationLink>
        <div className={styles.actions}>
          <LanguageSelector />
          <Spinner loading={pending} />
        </div>
      </div>
    </header>
  );
};
