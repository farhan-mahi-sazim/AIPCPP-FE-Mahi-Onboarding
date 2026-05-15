export type TFileUploadSectionProps = {
  labelText: string;
  uploadError?: string | undefined;
  uploadButtonOnChangeHandler: (document: File | null) => void;
  fileAcceptTypes: string;
};
