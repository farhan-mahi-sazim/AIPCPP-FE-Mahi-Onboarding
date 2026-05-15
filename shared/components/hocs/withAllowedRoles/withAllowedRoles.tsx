import { ComponentProps } from "react";

import { EUserRole } from "@/shared/redux/rtk-apis/modules/auth/auth.types";

import { TAuthGuardProps } from "../../wrappers/AuthGuard/AuthGuard.types";

export const withAllowedRoles = (
  AuthGuard: React.ComponentType<TAuthGuardProps>,
  allowedRoles?: EUserRole[],
) => {
  function Wrapper(props: ComponentProps<typeof AuthGuard>) {
    return <AuthGuard allowedRoles={allowedRoles}>{props.children}</AuthGuard>;
  }
  return Wrapper;
};
