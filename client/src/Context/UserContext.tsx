'use client';

import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';

type PropsUser = {
  progress: boolean;
  setProgress: Dispatch<SetStateAction<boolean>>;
};

export const ProgressContext = React.createContext<PropsUser>({
  progress: false,
  setProgress: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function ProgressProvider({ children }: Props) {
  const [progress, setProgress] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({
      progress,
      setProgress,
    }),
    [progress]
  );

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}
