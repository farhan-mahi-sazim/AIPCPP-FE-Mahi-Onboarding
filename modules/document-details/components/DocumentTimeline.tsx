import React from "react";

import { STRINGS } from "@/shared/constants/strings.constants";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";

interface IDocumentTimelineProps {
  timelineItems?: TTimelineItem[];
}

const DocumentTimeline: React.FC<IDocumentTimelineProps> = ({ timelineItems }) => (
  <>
    <h2 className="text-lg font-semibold mb-4 text-on-surface">{STRINGS.details.timeline}</h2>
    <div className="flex flex-col gap-4">
      {timelineItems && timelineItems.length > 0 ? (
        timelineItems.map((item: TTimelineItem) => (
          <div key={item.id} className="border-l-2 border-white/10 pl-4 relative">
            <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-on-surface">
                Version {item.version_number} ({item.source})
              </p>
              <p className="text-xs text-outline">{new Date(item.created_at).toLocaleString()}</p>
            </div>
            <p className="text-sm text-on-surface-variant mt-2 bg-white/5 p-3 rounded-lg border border-white/5">
              {item.data?.summary}
            </p>
          </div>
        ))
      ) : (
        <div className="text-outline">{STRINGS.details.noTimeline}</div>
      )}
    </div>
  </>
);

export default DocumentTimeline;
