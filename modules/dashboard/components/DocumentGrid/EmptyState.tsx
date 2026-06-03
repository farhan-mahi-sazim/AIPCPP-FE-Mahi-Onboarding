import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

const EmptyState: React.FC = () => (
  <div className="text-center col-span-full py-12 text-outline">
    <p>{STRINGS.dashboard.empty}</p>
  </div>
);

export default EmptyState;
