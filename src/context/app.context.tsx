import { User } from "@/@types/auth.type";
import { profile } from "@/services/auth.services";
import { getAccessTokenFromLS, getUserFromLS } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContextType = {
  user: User | undefined;
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

const initialAppContext: AppContextType = {
  isAuth: Boolean(getAccessTokenFromLS()),
  setIsAuth: () => {},
  setUser: () => {},
  user: getUserFromLS(),
};
export const AppContext = createContext(initialAppContext);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (typeof context === "undefined")
    throw new Error("Provider not wrap the app");
  return context;
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined>(initialAppContext.user);

  const [isAuth, setIsAuth] = useState(false);

  const fetchMeQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => profile(),
    enabled: Boolean(getAccessTokenFromLS()),
    onSuccess: (data) => {
      setIsAuth(true);
    },
  });

  return (
    <AppContext.Provider value={{ isAuth, user, setUser, setIsAuth }}>
      {children}
    </AppContext.Provider>
  );
};
