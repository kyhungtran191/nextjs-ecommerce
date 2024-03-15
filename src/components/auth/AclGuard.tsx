// ** React Imports
import { ACLObj } from "@/configs/acl";
import { ReactNode } from "react";

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

  return <>{children}</>;
};

export default AclGuard;
