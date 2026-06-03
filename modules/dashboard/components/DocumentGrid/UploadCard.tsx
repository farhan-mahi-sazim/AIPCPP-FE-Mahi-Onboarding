import React from "react";

import { MdAdd } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

interface UploadCardProps {
  onClick?: () => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onClick }) => (
  <button
    className="border-2 border-dashed border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-all cursor-pointer bg-white/[0.02] w-full text-left"
    onClick={onClick}
    aria-label={STRINGS.dashboard.uploadAria}
  >
    <div className="w-12 h-12 flex-shrink-0 bg-surface-container-highest/50 rounded-lg flex items-center justify-center text-outline group-hover:text-primary transition-colors">
      <MdAdd className="text-[28px]" />
    </div>
    <div>
      <p className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">
        {STRINGS.dashboard.uploadTitle}
      </p>
      <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">
        {STRINGS.dashboard.uploadSubtitle}
      </p>
    </div>
  </button>
);

export default UploadCard;
