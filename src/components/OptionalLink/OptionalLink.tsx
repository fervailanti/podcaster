'use client';

import type { ReactNode } from 'react';

import { NavigationLink } from '@/navigation';

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
};

export const OptionalLink = ({ children, href, className }: Props) =>
  href ? (
    <NavigationLink href={href} className={className}>
      {children}
    </NavigationLink>
  ) : (
    children
  );
