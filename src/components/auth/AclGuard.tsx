import { ACLObj, AppAbility, buildAbilityFor } from "@/configs/acl";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { AbilityContext } from "../acl/Can";
import NotAuthorized from "@/pages/401";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import { PERMISSIONS } from "@/configs/permission";

// ** Types

interface AclGuardProps {
  children: ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  aclAbilities: ACLObj;
  permissions: string[];
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const {
    aclAbilities,
    children,
    guestGuard = false,
    authGuard = true,
    permissions,
  } = props;
  const { isAuth, user } = useAppContext();
  let ability: any;
  const router = useRouter();

  const permissionUser = user?.role?.permissions
    ? user?.role?.permissions?.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : user?.role?.permissions
    : [];

  if (isAuth && !ability) {
    ability = buildAbilityFor(permissionUser, permissions);
  }
  if (
    guestGuard ||
    router.route === "/500" ||
    router.route === "404" ||
    !authGuard
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
  return <NotAuthorized></NotAuthorized>;
};
export default AclGuard;
