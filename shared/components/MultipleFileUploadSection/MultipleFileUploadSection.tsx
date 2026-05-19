import { useState } from "react";

import { FileButton, Button, Text, Container } from "@mantine/core";

import ImageGalleryHorizontal from "../ImageGalleryHorizontal";
import { TMultipleFileUploadSectionProps } from "./MultipleFileUploadSection.types";

const MultipleFileUploadSection = ({
  labelText,
  uploadError,
  uploadButtonOnChangeHandler,
  fileAcceptTypes,
  showImages,
  shouldOverride = true,
  removeButtonOnChangeHandler,
}: TMultipleFileUploadSectionProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleRemove = (index: number) => {
    if (index < uploadedFiles.length) {
      setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

      if (removeButtonOnChangeHandler) {
        removeButtonOnChangeHandler(index);
      }
    }
  };

  return (
    <>
      <Text color={uploadError ? "red" : "black"}>
        {labelText} {uploadError ? `(${uploadError})` : ""}
      </Text>
      <FileButton
        onChange={(documents: File[] | null) => {
          if (shouldOverride) {
            const newDocuments = documents ? documents : [];
            setUploadedFiles(newDocuments);
          } else if (documents) {
            setUploadedFiles((prevDocuments) => [...prevDocuments, ...documents]);
          }

          uploadButtonOnChangeHandler(documents);
        }}
        accept={fileAcceptTypes}
        multiple
      >
        {(props) => (
          <Button color="green" {...props} variant="outline">
            Upload {showImages ? "Images" : "Documents"}
          </Button>
        )}
      </FileButton>
      {showImages ? (
        <Container m={10}>
          <ImageGalleryHorizontal files={uploadedFiles} canDelete onRemove={handleRemove} />
        </Container>
      ) : (
        uploadedFiles.length > 0 && (
          <Text>File name: {uploadedFiles.map((file) => file.name).join(", ")}</Text>
        )
      )}
    </>
  );
};

export default MultipleFileUploadSection;
