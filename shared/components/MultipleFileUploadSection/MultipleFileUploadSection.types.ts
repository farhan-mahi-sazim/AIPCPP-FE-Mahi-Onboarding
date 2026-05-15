import { TFileUploadSectionProps } from "../FileUploadSection/FileUploadSection.types";

export type TMultipleFileUploadSectionProps = Omit<
  TFileUploadSectionProps,
  "uploadButtonOnChangeHandler"
> & {
  showImages?: boolean;
  shouldOverride?: boolean;
  uploadButtonOnChangeHandler: (documents: File[] | null) => void;
  removeButtonOnChangeHandler?: (index: number) => void;
};
