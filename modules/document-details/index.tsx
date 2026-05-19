import React from "react";

import { useRouter } from "next/router";

import { notifications } from "@mantine/notifications";
import { MdArrowBack } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";

import DocumentHeader from "./components/DocumentHeader";
import DocumentInfo from "./components/DocumentInfo";
import DocumentTimeline from "./components/DocumentTimeline";

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
          <DocumentHeader
            id={id as string}
            filename={documentData?.filename}
            isDeleting={isDeleting}
            onDelete={handleDelete}
          />

          <DocumentInfo
            category={documentData?.category}
            summary={documentData?.summary}
            tags={documentData?.tags}
          />

          <hr className="my-6 border-white/5" />

          <DocumentTimeline timelineItems={timelineData?.items} />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
