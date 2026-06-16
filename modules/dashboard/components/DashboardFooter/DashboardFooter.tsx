import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

const FOOTER_LINKS = [STRINGS.footer.systemHealth, STRINGS.footer.compliance, STRINGS.footer.docs];

const DashboardFooter: React.FC = () => (
  <footer className="mt-section-gap pt-gutter border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-gutter">
    <div className="flex items-center gap-base">
      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <span className="text-label-sm text-on-surface-variant">{STRINGS.footer.version}</span>
    </div>
    <nav className="flex gap-gutter">
      {FOOTER_LINKS.map((link) => (
        <span
          key={link}
          className="text-label-sm text-outline hover:text-on-surface cursor-pointer transition-colors"
        >
          {link}
        </span>
      ))}
    </nav>
  </footer>
);

export default DashboardFooter;
