import React from "react";

import { useRouter } from "next/router";

import clsx from "clsx";
import { MdChevronLeft, MdChevronRight, MdAdd } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

import { MENU_ITEMS } from "./SideNavBar.constants";
import { ISideNavBarProps } from "./SideNavBar.types";

const SideNavBar: React.FC<ISideNavBarProps> = ({ isCollapsed, onToggle }) => {
  const router = useRouter();

  return (
    <div
      className={clsx(
        "h-screen bg-surface-container/30 backdrop-blur-md border-r border-white/5 flex flex-col p-4 fixed left-0 top-0 z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface-container border border-white/10 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors shadow-lg z-50"
        aria-label={isCollapsed ? STRINGS.sidebar.expandSidebar : STRINGS.sidebar.collapseSidebar}
      >
        {isCollapsed ? (
          <MdChevronRight className="text-sm" />
        ) : (
          <MdChevronLeft className="text-sm" />
        )}
      </button>

      <div
        className={clsx(
          "flex items-center mb-10",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-xl flex-shrink-0">
            {STRINGS.sidebar.brandInitial}
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

      <nav className="flex-1 flex flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = router.pathname === item.href && !item.disabled;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) router.push(item.href);
              }}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left",
                isActive
                  ? "bg-primary/10 text-primary"
                  : item.disabled
                    ? "text-outline/40 cursor-not-allowed"
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

      <button
        onClick={() =>
          router.push({ pathname: "/dashboard", query: { upload: "true" } }, undefined, {
            shallow: true,
          })
        }
        className={clsx(
          "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left mb-4",
          "bg-primary/10 text-primary hover:bg-primary/20",
          isCollapsed && "justify-center px-0",
        )}
        title={isCollapsed ? STRINGS.sidebar.uploadDocument : undefined}
      >
        <MdAdd className="text-xl flex-shrink-0" />
        {!isCollapsed && <span className="truncate">{STRINGS.sidebar.uploadDocument}</span>}
      </button>

      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-medium flex-shrink-0">
            {STRINGS.sidebar.userInitials}
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <p className="text-sm font-medium text-on-surface truncate">
                {STRINGS.sidebar.userName}
              </p>
              <p className="text-xs text-outline truncate">{STRINGS.sidebar.mode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
