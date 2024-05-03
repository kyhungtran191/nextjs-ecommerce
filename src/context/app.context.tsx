import { User } from "@/@types/auth.type";
import { getAccessTokenFromLS } from "@/utils/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContextType = {
  user: User | {};
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<{} | User>>;
};

const initialAppContext: AppContextType = {
  isAuth: Boolean(getAccessTokenFromLS()),
  setIsAuth: () => {},
  setUser: () => {},
  user: {},
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
  const [user, setUser] = useState<User | {}>({});
  const [isAuth, setIsAuth] = useState(Boolean(getAccessTokenFromLS()));

  return (
    <AppContext.Provider value={{ isAuth, user, setUser, setIsAuth }}>
      {children}
    </AppContext.Provider>
  );
};
