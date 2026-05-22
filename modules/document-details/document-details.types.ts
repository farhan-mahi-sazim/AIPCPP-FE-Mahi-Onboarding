import { UseFormReturn } from "react-hook-form";
import { TDocumentDetailsForm } from "./document-details.schema";

export interface IDocumentEditFormProps {
  form: UseFormReturn<TDocumentDetailsForm>;
  isSubmitting: boolean;
  onSubmit: (values: TDocumentDetailsForm) => void;
  onCancel: () => void;
  isCreateNewVersion: boolean;
  setIsCreateNewVersion: (val: boolean) => void;
  showCreateNewOption: boolean;
}
