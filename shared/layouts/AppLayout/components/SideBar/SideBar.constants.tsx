import { AiOutlineDollar } from "react-icons/ai";
import { MdGroups2 } from "react-icons/md";
import { MdOutlineListAlt } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { TbBuildingCommunity } from "react-icons/tb";
import { TbGraph } from "react-icons/tb";
import { VscTools } from "react-icons/vsc";

import { STRINGS } from "@/shared/constants/strings.constants";

export const BUTTON_STYLE = {
  display: "flex",
  fontSize: "1em",
  fontWeight: 400,
  height: "3.2em",
  borderRadius: "0.7em",
  marginBottom: "0.7em",
};

export const NAV_LINKS = [
  {
    label: STRINGS.nav.properties,
    href: "/properties",
    icon: <TbBuildingCommunity />,
  },
  {
    label: STRINGS.nav.applications,
    href: "/applications",
    icon: <RiFilePaper2Line />,
  },
  {
    label: STRINGS.nav.people,
    href: "/people",
    icon: <MdGroups2 />,
  },
  {
    label: STRINGS.nav.leases,
    href: "/leases",
    icon: <MdOutlineListAlt />,
  },
  {
    label: STRINGS.nav.payments,
    href: "/payments",
    icon: <AiOutlineDollar />,
  },
  {
    label: STRINGS.nav.tasks,
    href: "/tasks",
    icon: <VscTools />,
  },
  {
    label: STRINGS.nav.rentReceipts,
    href: "/rent-receipts",
    icon: <TbGraph />,
  },
];
