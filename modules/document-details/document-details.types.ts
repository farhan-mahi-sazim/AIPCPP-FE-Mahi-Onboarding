import { UseFormReturn } from "react-hook-form";

import { ITimelineItem } from "@/shared/typedefs/common.types";

import { TDocumentDetailsForm } from "./document-details.schema";

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
  timelineItems: ITimelineItem[] | undefined;
  isLoading: boolean;
  error: unknown;
  isDeleting: boolean;
  handleDelete: () => void;
  handleBack: () => void;
  selectedVersionId: string | null;
  selectedVersion: ITimelineItem | undefined;
  onSelectVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => Promise<void>;
  isSelectedVersionAI: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  startEditCurrent: () => void;
  startOverride: () => void;
  isCreateNewVersion: boolean;
  setIsCreateNewVersion: (val: boolean) => void;
  showCreateNewOption: boolean;
  form: UseFormReturn<TDocumentDetailsForm>;
  isSubmitting: boolean;
  onSubmit: (values: TDocumentDetailsForm) => Promise<void>;
}

export interface IDocumentEditFormProps {
  form: UseFormReturn<TDocumentDetailsForm>;
  isSubmitting: boolean;
  onSubmit: (values: TDocumentDetailsForm) => void;
  onCancel: () => void;
  isCreateNewVersion: boolean;
  setIsCreateNewVersion: (val: boolean) => void;
  showCreateNewOption: boolean;
}
