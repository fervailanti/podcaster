'use client';

import { useContext } from 'react';

import { NavigationContext } from '../NavigationProvider';

export const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) throw new Error('NavigationProvider is missing');

  return context;
};
