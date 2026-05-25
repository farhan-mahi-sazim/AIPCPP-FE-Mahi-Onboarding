import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";

interface IDocumentInfoProps {
  category?: string;
  summary?: string;
  summary_title?: string;
  tags?: string[];
}

const DocumentInfo: React.FC<IDocumentInfoProps> = ({ category, summary, summary_title, tags }) => {
  if (!category && !summary && !summary_title && (!tags || tags.length === 0)) {
    return <div className="text-outline">{STRINGS.details.noData}</div>;
  }

  return (
    <div className="space-y-4">
      {summary_title && (
        <div>
          <h3 className="text-sm font-medium text-outline">{STRINGS.details.info.title}</h3>
          <p className="text-on-surface font-medium">{summary_title}</p>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-outline">{STRINGS.details.info.category}</h3>
        <p className="text-on-surface">{category || STRINGS.details.info.notAvailable}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-outline">{STRINGS.details.info.summary}</h3>
        <p className="text-on-surface">{summary || STRINGS.details.info.notAvailable}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-outline">{STRINGS.details.info.tags}</h3>
        <div className="flex gap-2 mt-1">
          {tags && tags.length > 0
            ? tags.map((tag: string) => (
                <span key={tag} className="bg-white/5 text-outline text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))
            : STRINGS.details.info.notAvailable}
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
