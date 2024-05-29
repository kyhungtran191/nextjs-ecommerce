import { ACLObj, AppAbility, buildAbilityFor } from "@/configs/acl";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { AbilityContext } from "../acl/Can";
import NotAuthorized from "@/pages/401";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";

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
  let ability: any;
  const router = useRouter();
  // if (typeof window !== "undefined") {
  const permissionUser = user?.role?.permissions || [];
  if (isAuth && !ability) {
    ability = buildAbilityFor(permissionUser, aclAbilities.subject);
  }
  if (
    guestGuard ||
    router.route === "/500" ||
    router.route === "404"
    // ||!authGuard
  ) {
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
  return <>{children}</>;
};
export default AclGuard;
