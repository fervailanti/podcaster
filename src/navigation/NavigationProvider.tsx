'use client';

import { createContext, type ReactNode, useCallback, useState } from 'react';

export type NavigationState = {
  pending: boolean;
  begin: () => void;
  complete: () => void;
};

export const NavigationContext = createContext<NavigationState | null>(null);

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
