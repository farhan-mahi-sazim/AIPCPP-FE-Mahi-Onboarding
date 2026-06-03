import React, { PropsWithChildren, useState } from "react";

import clsx from "clsx";

import SideNavBar from "../SideNavBar/SideNavBar";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div
        className={clsx("flex-1 transition-all duration-300 pl-6", isCollapsed ? "ml-20" : "ml-64")}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
