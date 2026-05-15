import type { NextRouter } from "next/router";

import { LOGIN_ROUTE } from "@/shared/constants/route.constants";
import blcApi from "@/shared/redux/rtk-apis/blc/blc.api";

import { clearUser } from "../../redux/reducers/user.reducer";
import { TAppDispatch } from "../../redux/store";
import { SIGN_OUT_EVENT_NAME } from "./signOut.constants";
import { ESignOutReason } from "./signOut.enums";

const emitSignOutEvent = (signOutReason: ESignOutReason) => {
  localStorage.setItem(SIGN_OUT_EVENT_NAME, signOutReason);
  localStorage.removeItem(SIGN_OUT_EVENT_NAME);
};

export const signOut = ({
  dispatch,
  router,
  reason,
  redirectRoute = LOGIN_ROUTE,
  shouldEmitSignOutEvent = true,
}: {
  dispatch: TAppDispatch;
  router: NextRouter;
  reason: ESignOutReason;
  redirectRoute?: string;
  shouldEmitSignOutEvent?: boolean;
}) => {
  localStorage.clear();

  dispatch(clearUser());
  dispatch(blcApi.util.resetApiState());

  if (shouldEmitSignOutEvent) {
    emitSignOutEvent(reason);
  }

  router.push(redirectRoute);
};
