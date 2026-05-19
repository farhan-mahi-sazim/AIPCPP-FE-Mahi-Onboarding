import React, { useContext } from "react";

import Image from "next/image";

import { CloseButton } from "@mantine/core";

import { EditImagesContext } from "@/shared/contexts/EditImages/EditImages.context";
import { constructFullUrl } from "@/shared/utils/constructFullUrl";

import { useImageGalleryHorizontalStyles } from "./ImageGalleryHorizontal.styles";
import { TImageGalleryHorizontalProps } from "./ImageGalleryHorizontal.types";

const ImageGalleryHorizontal: React.FC<TImageGalleryHorizontalProps> = ({
  files,
  onRemove,
  canDelete = false,
}) => {
  const { classes } = useImageGalleryHorizontalStyles();
  const {
    state: { existingImages },
    actions: { setImageIdsToRemove },
  } = useContext(EditImagesContext);

  const handleRemove = (index: number) => {
    if (index < files.length) {
      if (onRemove) {
        onRemove(index);
      }
    } else {
      const existingImageIndex = index - files.length;
      const imageToRemove = existingImages[existingImageIndex];
      if (imageToRemove) {
        setImageIdsToRemove(imageToRemove.id);
      }
    }
  };

  return (
    <div className={classes.galleryContainer}>
      {files.length
        ? files.map((file, index) => (
            <div key={index} className={classes.imageContainer}>
              <Image
                src={URL.createObjectURL(file)}
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
                alt={`Uploaded file ${index + 1}`}
              />

              {canDelete && (
                <CloseButton
                  aria-label="Remove image"
                  onClick={() => handleRemove(index)}
                  className={classes.closeButton}
                  color="red"
                />
              )}
            </div>
          ))
        : null}
      {existingImages?.length > 0
        ? existingImages?.map?.((image, index) => (
            <div key={index} className={classes.imageContainer}>
              <Image
                src={constructFullUrl(image.url)}
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
                alt={`Uploaded file ${index + 1}`}
              />
              {canDelete && (
                <CloseButton
                  aria-label="Remove image"
                  onClick={() => handleRemove(index + files.length)}
                  className={classes.closeButton}
                  color="red"
                />
              )}
            </div>
          ))
        : null}
    </div>
  );
};

export default ImageGalleryHorizontal;
