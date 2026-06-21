export interface INavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  disabled: boolean;
}

export interface ISideNavBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}
