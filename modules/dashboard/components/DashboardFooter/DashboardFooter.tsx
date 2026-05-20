import React from "react";

const DashboardFooter: React.FC = () => (
  <footer className="mt-section-gap pt-gutter border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-gutter">
    <div className="flex items-center gap-base">
      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <span className="text-label-sm text-on-surface-variant">AIPCPP Neural Core v1.0.0</span>
    </div>
    <nav className="flex gap-gutter">
      {["System Health", "Compliance", "Docs"].map((link) => (
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
