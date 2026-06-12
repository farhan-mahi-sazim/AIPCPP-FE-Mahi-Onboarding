import { ADDITIONAL_ROUTES } from "@/shared/constants/route.constants";

import { NAV_LINKS } from "./components/SideBar/SideBar.constants";

export function getCurrentPageName(pathname: string): string {
  const currentLink =
    NAV_LINKS.find(({ href }) => pathname.includes(href)) ||
    ADDITIONAL_ROUTES.find(({ href }) => pathname.includes(href));
  return currentLink ? currentLink.label : "Unknown Page";
}
