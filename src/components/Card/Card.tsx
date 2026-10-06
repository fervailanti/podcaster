import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Card.module.css';

type Props = Omit<HTMLAttributes<HTMLElement>, 'className'> & {
  as?: 'div' | 'aside' | 'article' | 'section';
  children: ReactNode;
  className?: string;
  clickable?: boolean;
};

export const Card = ({
  as: Element = 'div',
  children,
  className,
  clickable = false,
  ...rest
}: Props) => (
  <Element
    {...rest}
    className={`${styles.card} ${clickable ? styles.clickable : ''} ${className ?? ''}`}
  >
    {children}
  </Element>
);
