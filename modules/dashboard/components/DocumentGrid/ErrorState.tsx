import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

interface ErrorStateProps {
  error: unknown;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="text-center col-span-full py-12">
    <p className="text-error font-semibold">{STRINGS.dashboard.loadError}</p>
    <p className="text-xs text-outline mt-2">{JSON.stringify(error)}</p>
  </div>
);

export default ErrorState;
