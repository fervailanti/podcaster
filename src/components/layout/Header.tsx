'use client';

import { useTranslation } from 'react-i18next';
import { NavigationLink } from './NavigationLink';
import { useNavigation } from './NavigationProvider';
import { isLocale } from '@/i18n/locales';
import styles from './Header.module.css';

export function Header() {
  const { t, i18n } = useTranslation();
  const { pending } = useNavigation();

  function changeLanguage(value: string) {
    if (!isLocale(value)) return;
    void i18n.changeLanguage(value);
    document.cookie = `podcaster-locale=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = value;
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavigationLink
          href="/"
          className={styles.brand}
          aria-label={t('backToDiscover')}
        >
          <span className={styles.mark} aria-hidden="true">
            ◉
          </span>
          {t('appName')}
          <span className={styles.dot}>.</span>
        </NavigationLink>
        <div className={styles.actions}>
          <label className={styles.language}>
            <span className="srOnly">{t('language')}</span>
            <span aria-hidden="true">◎</span>
            <select
              aria-label={t('language')}
              value={i18n.resolvedLanguage ?? 'es'}
              onChange={(event) => changeLanguage(event.target.value)}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </label>
          <span
            className={styles.status}
            role="status"
            aria-label={pending ? t('loading') : undefined}
          >
            {pending && <span className={styles.spinner} />}
          </span>
        </div>
      </div>
    </header>
  );
}
