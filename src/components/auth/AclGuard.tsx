import { useEffect, useState } from "react";
import { ACLObj, AppAbility, buildAbilityFor } from "@/configs/acl";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { AbilityContext } from "../acl/Can";
import NotAuthorized from "@/pages/401";
import ComponentsLoading from "../loading/ComponentsLoading";

// ** Types
interface AclGuardProps {
  children: ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  aclAbilities: ACLObj;
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const {
    aclAbilities,
    children,
    guestGuard = false,
    authGuard = true,
  } = props;
  const { isAuth, user } = useAppContext();
  const [ability, setAbility] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      const permissionUser = user?.role?.permissions || [];
      const builtAbility = buildAbilityFor(
        permissionUser,
        aclAbilities.subject
      );
      setAbility(builtAbility);
    }
    setIsMounted(true);
  }, [isAuth, user, aclAbilities.subject]);

  if (guestGuard || router.route === "/500" || router.route === "/404") {
    if (isAuth && ability) {
      return (
        <AbilityContext.Provider value={ability}>
          {children}
        </AbilityContext.Provider>
      );
    } else {
      return <>{children}</>;
    }
  }

  if (
    ability &&
    isAuth &&
    ability.can(aclAbilities.action, aclAbilities.subject)
  ) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  return <NotAuthorized />;
};

export default AclGuard;
