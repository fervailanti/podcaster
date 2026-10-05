'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useNavigation } from './NavigationProvider';

export function NavigationLink(props: ComponentProps<typeof Link>) {
  const { begin } = useNavigation();
  const pathname = usePathname();
  return (
    <Link
      {...props}
      onNavigate={(event) => {
        if (typeof props.href !== 'string' || props.href !== pathname) begin();
        props.onNavigate?.(event);
      }}
    />
  );
}
