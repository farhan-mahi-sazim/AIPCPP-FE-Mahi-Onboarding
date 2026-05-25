import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

const LoadingState: React.FC = () => (
  <div className="text-center col-span-full py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
    <p className="mt-4 text-outline">{STRINGS.dashboard.loading}</p>
  </div>
);

export default LoadingState;
