'use client';

import { useEffect } from 'react';

import { useNavigation } from './NavigationProvider/NavigationProvider';

export const useNavigationComplete = (loading: boolean, title: string) => {
  const { complete } = useNavigation();

  useEffect(() => {
    if (loading) return;

    document.title = title;
    complete();
  }, [loading, title, complete]);
};
