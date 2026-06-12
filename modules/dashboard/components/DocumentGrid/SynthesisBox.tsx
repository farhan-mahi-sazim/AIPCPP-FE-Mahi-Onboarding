import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

import { ISynthesisBoxProps } from "./SynthesisBox.types";

const SynthesisBox: React.FC<ISynthesisBoxProps> = ({ answer }) => (
  <section className="col-span-full bg-gradient-to-r from-primary/10 via-surface-container to-surface-container border border-primary/20 rounded-2xl p-5 text-on-surface shadow-[0_0_30px_rgba(59,130,246,0.1)]">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">
      <span className="w-2 h-2 rounded-full bg-primary/80" />
      {STRINGS.dashboard.synthesis}
    </div>
    <p className="text-body-md text-on-surface leading-relaxed">{answer}</p>
  </section>
);

export default SynthesisBox;
