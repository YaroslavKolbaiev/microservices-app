'use client';

import { userService } from '@/services/userServices';
import { CurrentUser } from '@/types/User';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

type PropsUser = {
  currentUser: CurrentUser | null;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser | null>>;
};

export const UserContext = React.createContext<PropsUser>({
  currentUser: null,
  setCurrentUser: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
