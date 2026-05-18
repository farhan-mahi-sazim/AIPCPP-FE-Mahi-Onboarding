import React from "react";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { MdDelete, MdArrowBack } from "react-icons/md";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";
import { STRINGS } from "@/shared/constants/strings.constants";

const DocumentDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: timelineData,
    isLoading,
    error,
  } = useGetDocumentTimelineQuery(id as string, {
    skip: !id,
  });

  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const handleDelete = async () => {
    if (!id) return;
    if (confirm(STRINGS.details.deleteConfirm)) {
      try {
        await deleteDocument(id as string).unwrap();
        notifications.show({
          title: STRINGS.details.deleted,
          message: STRINGS.details.deletedMsg,
          color: "teal",
        });
        router.push("/dashboard");
      } catch (err) {
        console.error("Delete failed", err);
        notifications.show({
          title: STRINGS.details.error,
          message: STRINGS.details.errorMsg,
          color: "red",
        });
      }
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading details...</div>;
  if (error) return <div className="text-center py-12 text-error">Failed to load details.</div>;

  // Assuming items are sorted by version or date, pick the first one as latest
  const latestVersion = timelineData?.items?.[0];
  const documentData = latestVersion?.data;

  return (
    <div className="min-h-screen bg-background text-on-surface p-6">
      <div className="max-w-4xl mx-auto">
        <button
          className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors"
          onClick={() => router.push("/dashboard")}
        >
          <MdArrowBack /> {STRINGS.details.back}
        </button>

        <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-on-surface">{STRINGS.details.title}</h1>
              <p className="text-sm text-outline mt-1">ID: {id}</p>
            </div>
            <button
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <MdDelete /> {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          {documentData ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-outline">Category</h3>
                <p className="text-on-surface">{documentData.category || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-outline">Summary</h3>
                <p className="text-on-surface">{documentData.summary || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-outline">Tags</h3>
                <div className="flex gap-2 mt-1">
                  {documentData.tags?.map((tag: string) => (
                    <span key={tag} className="bg-white/5 text-outline text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  )) || "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-outline">{STRINGS.details.noData}</div>
          )}

          <hr className="my-6 border-white/5" />

          <h2 className="text-lg font-semibold mb-4 text-on-surface">{STRINGS.details.timeline}</h2>
          <div className="flex flex-col gap-4">
            {timelineData?.items?.map((item: TTimelineItem) => (
              <div key={item.id} className="border-l-2 border-white/10 pl-4 relative">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-on-surface">
                    Version {item.version_number} ({item.source})
                  </p>
                  <p className="text-xs text-outline">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-outline-variant mt-1">{item.data?.summary}</p>
              </div>
            )) || <div className="text-outline">{STRINGS.details.noTimeline}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
