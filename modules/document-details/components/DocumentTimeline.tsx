import React from "react";

import { MdDelete } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";

interface IDocumentTimelineProps {
  timelineItems?: TTimelineItem[];
  selectedVersionId?: string;
  onSelectVersion: (id: string) => void;
  onDeleteVersion?: (id: string) => void;
}

const DocumentTimeline: React.FC<IDocumentTimelineProps> = ({
  timelineItems,
  selectedVersionId,
  onSelectVersion,
  onDeleteVersion,
}) => (
  <>
    <h2 className="text-lg font-semibold mb-4 text-on-surface">{STRINGS.details.timeline}</h2>
    <div className="flex flex-col gap-4">
      {timelineItems && timelineItems.length > 0 ? (
        timelineItems.map((item: TTimelineItem) => {
          const isSelected = selectedVersionId ? item.id === selectedVersionId : false;
          const isHuman = item.source === "HUMAN";
          return (
            <div
              key={item.id}
              onClick={() => onSelectVersion(item.id)}
              className={`border-l-2 pl-4 relative cursor-pointer transition-all duration-200 group py-2 pr-2 rounded-r-lg ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5"
                  : "border-white/10 hover:border-white/30 hover:bg-white/5"
              }`}
            >
              {/* Timeline Bullet */}
              <div
                className={`absolute w-3 h-3 rounded-full -left-[7px] top-[14px] transition-colors duration-200 ${
                  isSelected ? "bg-indigo-500" : "bg-outline group-hover:bg-on-surface"
                }`}
              />
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isSelected ? "text-indigo-300" : "text-on-surface"
                    }`}
                  >
                    {STRINGS.details.timelineVersion} {item.version_number}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full select-none ${
                      isHuman
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    }`}
                  >
                    {item.source}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-outline font-light">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  {isHuman && onDeleteVersion && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVersion(item.id);
                      }}
                      className="p-1 rounded-md text-outline hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title={STRINGS.details.timelineDeleteTitle}
                    >
                      <MdDelete size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 bg-white/5 p-3 rounded-lg border border-white/5 line-clamp-2 group-hover:line-clamp-none transition-all">
                {item.data?.summary || STRINGS.details.timelineNoSummary}
              </p>
            </div>
          );
        })
      ) : (
        <div className="text-outline text-sm">{STRINGS.details.noTimeline}</div>
      )}
    </div>
  </>
);

export default DocumentTimeline;
