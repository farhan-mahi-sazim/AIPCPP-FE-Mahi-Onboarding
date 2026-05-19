import React from "react";

import { useRouter } from "next/router";

import clsx from "clsx";
import {
  MdDashboard,
  MdFolder,
  MdSettings,
  MdAnalytics,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

interface ISideNavBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SideNavBar: React.FC<ISideNavBarProps> = ({ isCollapsed, onToggle }) => {
  const router = useRouter();

  const menuItems = [
    { icon: MdDashboard, label: STRINGS.sidebar.dashboard, href: "/dashboard" },
    { icon: MdFolder, label: STRINGS.sidebar.documents, href: "/dashboard" }, // Fallback to dashboard for now
    { icon: MdAnalytics, label: STRINGS.sidebar.analytics, href: "/dashboard" },
    { icon: MdSettings, label: STRINGS.sidebar.settings, href: "/dashboard" },
  ];

  return (
    <div
      className={clsx(
        "h-screen bg-surface-container/30 backdrop-blur-md border-r border-white/5 flex flex-col p-4 fixed left-0 top-0 z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Floating Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface-container border border-white/10 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors shadow-lg z-50"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <MdChevronRight className="text-sm" />
        ) : (
          <MdChevronLeft className="text-sm" />
        )}
      </button>

      {/* Header */}
      <div
        className={clsx(
          "flex items-center mb-10",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-xl flex-shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-lg font-semibold text-on-surface truncate">
                {STRINGS.sidebar.brand}
              </h1>
              <p className="text-[10px] text-outline uppercase tracking-widest truncate">
                {STRINGS.sidebar.brandSub}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-outline hover:bg-white/[0.02] hover:text-on-surface",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="text-xl flex-shrink-0" />
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-300">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-medium flex-shrink-0">
            FM
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <p className="text-sm font-medium text-on-surface truncate">Farhan Mahi</p>
              <p className="text-xs text-outline truncate">{STRINGS.sidebar.mode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
