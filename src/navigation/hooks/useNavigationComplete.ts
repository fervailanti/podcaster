'use client';

import { useEffect } from 'react';

import { useNavigation } from './useNavigation';

export const useNavigationComplete = (loading: boolean) => {
  const { complete } = useNavigation();

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);
};
