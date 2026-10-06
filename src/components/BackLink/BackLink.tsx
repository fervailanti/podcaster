import type { ReactNode } from 'react';

import { NavigationLink } from '@/navigation';

import { Eyebrow } from '../Eyebrow/Eyebrow';
import styles from './BackLink.module.css';

type Props = {
  children: ReactNode;
  href: string;
  icon?: ReactNode;
};

export const BackLink = ({ children, href, icon = '←' }: Props) => (
  <NavigationLink href={href} className={styles.link}>
    <span aria-hidden="true">{icon}</span>
    <span className={styles.label}>
      <Eyebrow>{children}</Eyebrow>
    </span>
  </NavigationLink>
);
