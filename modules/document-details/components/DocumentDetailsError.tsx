import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

interface DocumentDetailsErrorProps {
  onBack: () => void;
}

const DocumentDetailsError: React.FC<DocumentDetailsErrorProps> = ({ onBack }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
    <div className="max-w-md bg-surface-container/50 rounded-2xl p-8 border border-red-500/20 backdrop-blur-md">
      <h2 className="text-xl font-bold text-red-400 mb-2">{STRINGS.details.errorTitle}</h2>
      <p className="text-sm text-outline mb-6">{STRINGS.details.errorBody}</p>
      <button
        onClick={onBack}
        className="bg-white/5 hover:bg-white/10 text-on-surface px-6 py-2.5 rounded-lg border border-white/5 transition-colors font-medium text-sm"
      >
        {STRINGS.details.goBack}
      </button>
    </div>
  </div>
);

export default DocumentDetailsError;
