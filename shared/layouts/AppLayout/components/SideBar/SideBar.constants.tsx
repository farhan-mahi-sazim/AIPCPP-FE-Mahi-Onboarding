import { AiOutlineDollar } from "react-icons/ai";
import { MdGroups2 } from "react-icons/md";
import { MdOutlineListAlt } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { TbBuildingCommunity } from "react-icons/tb";
import { TbGraph } from "react-icons/tb";
import { VscTools } from "react-icons/vsc";

export const NAV_LINKS = [
  {
    label: "Properties",
    href: "/properties",
    icon: <TbBuildingCommunity />,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: <RiFilePaper2Line />,
  },
  {
    label: "People",
    href: "/people",
    icon: <MdGroups2 />,
  },
  {
    label: "Leases",
    href: "/leases",
    icon: <MdOutlineListAlt />,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: <AiOutlineDollar />,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: <VscTools />,
  },
  {
    label: "Rent Receipts",
    href: "/rent-receipts",
    icon: <TbGraph />,
  },
];
