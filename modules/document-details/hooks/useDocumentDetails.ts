import { useRouter } from "next/router";

import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";

export interface IUseDocumentDetailsReturn {
  id: string;
  documentData: ReturnType<typeof useGetDocumentTimelineQuery>["data"]["items"] extends Array<
    infer T
  >
    ? T["data"]
    : never;
  timelineItems: TTimelineItem[] | undefined;
  isLoading: boolean;
  error: unknown;
  isDeleting: boolean;
  handleDelete: () => Promise<void>;
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
