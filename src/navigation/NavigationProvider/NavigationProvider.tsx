'use client';

import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

type NavigationState = {
  pending: boolean;
  begin: () => void;
  complete: () => void;
};

const NavigationContext = createContext<NavigationState | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState(false);
  const begin = useCallback(() => setPending(true), []);
  const complete = useCallback(() => setPending(false), []);

  return (
    <NavigationContext.Provider value={{ pending, begin, complete }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('NavigationProvider is missing');
  return context;
};
