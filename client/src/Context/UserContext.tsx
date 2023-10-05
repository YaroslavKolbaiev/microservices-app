'use client';

import { CurrentUser } from '@/types/User';
import React, { Dispatch, SetStateAction, use, useMemo, useState } from 'react';

type PropsUser = {
  user: CurrentUser | null;
  setUser: Dispatch<SetStateAction<CurrentUser | null>>;
};

export const UserContext = React.createContext<PropsUser>({
  user: null,
  setUser: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
