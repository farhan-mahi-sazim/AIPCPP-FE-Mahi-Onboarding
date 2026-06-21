import { MdDashboard, MdFolder, MdSettings, MdAnalytics } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

import { INavItem } from "./SideNavBar.types";

export const MENU_ITEMS: INavItem[] = [
  { icon: MdDashboard, label: STRINGS.sidebar.dashboard, href: "/dashboard", disabled: false },
  { icon: MdFolder, label: STRINGS.sidebar.documents, href: "/dashboard", disabled: true },
  { icon: MdAnalytics, label: STRINGS.sidebar.analytics, href: "/dashboard", disabled: true },
  { icon: MdSettings, label: STRINGS.sidebar.settings, href: "/dashboard", disabled: true },
];
