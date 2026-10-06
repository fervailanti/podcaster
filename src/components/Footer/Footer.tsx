'use client';

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Footer.module.css';

export const Footer = ({ children }: { children?: ReactNode }) => {
  const { t } = useTranslation();
  return <footer className={styles.footer}>{children || t('providedBy')}</footer>;
};
