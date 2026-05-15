import { PropsWithChildren } from "react";

import { EUserRole } from "@/shared/redux/rtk-apis/modules/auth/auth.types";

type TAuthGuardParams = {
  allowedRoles?: EUserRole[];
};

export type TAuthGuardProps = PropsWithChildren<TAuthGuardParams>;
