import React from "react";
import { STRINGS } from "@/shared/constants/strings.constants";

interface IDocumentInfoProps {
  category?: string;
  summary?: string;
  tags?: string[];
}

const DocumentInfo: React.FC<IDocumentInfoProps> = ({ category, summary, tags }) => {
  if (!category && !summary && (!tags || tags.length === 0)) {
    return <div className="text-outline">{STRINGS.details.noData}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-outline">Category</h3>
        <p className="text-on-surface">{category || "N/A"}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-outline">Summary</h3>
        <p className="text-on-surface">{summary || "N/A"}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-outline">Tags</h3>
        <div className="flex gap-2 mt-1">
          {tags && tags.length > 0
            ? tags.map((tag: string) => (
                <span key={tag} className="bg-white/5 text-outline text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))
            : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
