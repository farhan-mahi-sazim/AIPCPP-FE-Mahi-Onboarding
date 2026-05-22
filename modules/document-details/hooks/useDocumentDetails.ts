import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useForm, UseFormReturn } from "react-hook-form";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
  useCreateVersionOverrideMutation,
  useUpdateHumanVersionMutation,
  useDeleteVersionMutation,
} from "@/shared/redux/rtk-apis/documents.api";
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";

import { documentDetailsZodResolver, TDocumentDetailsForm } from "../document-details.schema";

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
  // VCS features
  selectedVersionId: string | null;
  selectedVersion: TTimelineItem | undefined;
  onSelectVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => Promise<void>;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  isCreateNewVersion: boolean;
  setIsCreateNewVersion: (val: boolean) => void;
  showCreateNewOption: boolean;
  form: UseFormReturn<TDocumentDetailsForm>;
  isSubmitting: boolean;
  onSubmit: (values: TDocumentDetailsForm) => Promise<void>;
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
  const [createVersionOverride, { isLoading: isCreatingOverride }] =
    useCreateVersionOverrideMutation();
  const [updateHumanVersion, { isLoading: isUpdatingVersion }] = useUpdateHumanVersionMutation();
  const [deleteVersion] = useDeleteVersionMutation();

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateNewVersion, setIsCreateNewVersion] = useState(true);

  const latestVersion = timelineData?.items?.[0];
  const currentSelectedId = selectedVersionId || latestVersion?.id || null;
  const selectedVersion =
    timelineData?.items?.find((item) => item.id === currentSelectedId) || latestVersion;
  const documentData = selectedVersion?.data;

  const isSelectedVersionAI = selectedVersion?.source === "AI";
  const showCreateNewOption = !isSelectedVersionAI;

  const form = useForm<TDocumentDetailsForm>({
    resolver: documentDetailsZodResolver,
    defaultValues: {
      summary_title: "",
      category: "",
      summary: "",
      tags: "",
    },
  });

  const { reset } = form;

  // Reset form values when selectedVersion changes
  useEffect(() => {
    if (selectedVersion?.data) {
      reset({
        summary_title: selectedVersion.data.summary_title || "",
        category: selectedVersion.data.category || "",
        summary: selectedVersion.data.summary || "",
        tags: selectedVersion.data.tags?.join(", ") || "",
      });
    }
  }, [selectedVersion, reset]);

  // Force isCreateNewVersion to true if selected version is AI
  useEffect(() => {
    if (isSelectedVersionAI) {
      setIsCreateNewVersion(true);
    }
  }, [isSelectedVersionAI]);

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

  const onSelectVersion = (versionId: string) => {
    setSelectedVersionId(versionId);
    setIsEditing(false);
  };

  const onDeleteVersion = async (versionId: string) => {
    if (!id) return;
    try {
      await deleteVersion({
        versionId,
        documentId: id as string,
      }).unwrap();

      if (selectedVersionId === versionId) {
        setSelectedVersionId(null);
      }

      notifications.show({
        title: "Version Deleted",
        message: "The version override has been deleted successfully.",
        color: "teal",
      });
    } catch (err) {
      console.error("Delete version failed", err);
      notifications.show({
        title: "Delete Failed",
        message: "Failed to delete the version override.",
        color: "red",
      });
    }
  };

  const onSubmit = async (values: TDocumentDetailsForm) => {
    if (!id || !selectedVersion) return;

    const dataPayload = {
      summary_title: values.summary_title,
      category: values.category,
      summary: values.summary,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isCreateNewVersion) {
        const result = await createVersionOverride({
          documentId: id as string,
          data: dataPayload,
        }).unwrap();

        if (result?.id) {
          setSelectedVersionId(result.id);
        }

        notifications.show({
          title: "Version Created",
          message: "A new human override version has been saved.",
          color: "teal",
        });
      } else {
        await updateHumanVersion({
          versionId: selectedVersion.id,
          documentId: id as string,
          data: dataPayload,
        }).unwrap();

        notifications.show({
          title: "Version Updated",
          message: "The human override version has been updated.",
          color: "teal",
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Save version failed", err);
      notifications.show({
        title: "Save Failed",
        message: "Failed to save the document details.",
        color: "red",
      });
    }
  };

  return {
    id: id as string,
    documentData,
    timelineItems: timelineData?.items,
    isLoading,
    error,
    isDeleting,
    handleDelete,
    handleBack,
    selectedVersionId: currentSelectedId,
    selectedVersion,
    onSelectVersion,
    onDeleteVersion,
    isEditing,
    setIsEditing,
    isCreateNewVersion,
    setIsCreateNewVersion,
    showCreateNewOption,
    form,
    isSubmitting: isCreatingOverride || isUpdatingVersion,
    onSubmit,
  };
};
