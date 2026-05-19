import { useState } from "react";

import { FileButton, Button, Text } from "@mantine/core";

import { TFileUploadSectionProps } from "./FileUploadSection.types";

const FileUploadSection = ({
  labelText,
  uploadError,
  uploadButtonOnChangeHandler,
  fileAcceptTypes,
}: TFileUploadSectionProps) => {
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  return (
    <>
      <Text color={uploadError ? "red" : "black"}>
        {labelText} {uploadError ? `(${uploadError})` : ""}
      </Text>
      <FileButton
        onChange={(document: File | null) => {
          setUploadedFileName(document?.name ? document.name : "");
          uploadButtonOnChangeHandler(document);
        }}
        accept={fileAcceptTypes}
      >
        {(props) => (
          <Button color="green" {...props} variant="outline">
            Upload Document
          </Button>
        )}
      </FileButton>
      {uploadedFileName.length > 0 && <Text>File name: {uploadedFileName}</Text>}
    </>
  );
};

export default FileUploadSection;
