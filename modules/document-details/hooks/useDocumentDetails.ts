import { useRouter } from "next/router";

import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";

export interface IDocumentData {
  filename?: string;
  summary?: string;
  summary_title?: string;
  tags?: string[];
  category?: string;
}

export interface IUseDocumentDetailsReturn {
  id: string;
  documentData: IDocumentData | undefined;
  timelineItems: TTimelineItem[] | undefined;
  isLoading: boolean;
  error: unknown;
  isDeleting: boolean;
  handleDelete: () => void;
  handleBack: () => void;
}

export const useDocumentDetails = (): IUseDocumentDetailsReturn => {
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

  const handleDelete = () => {
    if (!id) return;
    modals.openConfirmModal({
      title: "Delete Document",
      children: STRINGS.details.deleteConfirm,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
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
      },
    });
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const latestVersion = timelineData?.items?.[0];
  const documentData = latestVersion?.data;

  return {
    id: id as string,
    documentData,
    timelineItems: timelineData?.items,
    isLoading,
    error,
    isDeleting,
    handleDelete,
    handleBack,
  };
};
