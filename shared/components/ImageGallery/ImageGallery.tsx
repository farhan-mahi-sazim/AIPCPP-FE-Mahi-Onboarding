import { useState } from "react";

import Image from "next/image";

import { Container, Modal, Text } from "@mantine/core";

import { constructFullUrl } from "@/shared/utils/constructFullUrl";

import { useImageGalleryStyle } from "./ImageGallery.style";
import { IImageGalleryProps } from "./ImageGallery.types";

const ImageGallery: React.FC<IImageGalleryProps> = ({ images, height }) => {
  const { classes } = useImageGalleryStyle({ height });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSelectedImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {images.length > 0 ? (
        <>
          <Modal
            className={classes.modal}
            opened={isModalOpen}
            fullScreen
            onClose={handleCloseModal}
            size="xl"
          >
            <Image
              className={classes.fullscreenImage}
              src={constructFullUrl(images[currentImageIndex]?.imageUrl)}
              fill
              alt={`Uploaded file 1`}
            />
          </Modal>

          <Container className={classes.galleryContainer}>
            <Container m="0" p="0">
              <Image
                className={classes.selectedImage}
                src={constructFullUrl(images[currentImageIndex]?.imageUrl)}
                width={500}
                height={500}
                alt={`Uploaded file 1`}
                onClick={handleSelectedImageClick}
              />
            </Container>
            <Container className={classes.imageCarouselContainer}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={index === currentImageIndex ? "" : classes.unselectedImage}
                >
                  <Image
                    className={classes.image}
                    src={constructFullUrl(image.imageUrl)}
                    width={200}
                    height={200}
                    alt={`Uploaded file ${index + 2}`}
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              ))}
            </Container>
          </Container>
        </>
      ) : (
        <Container fluid className={classes.noImagesContainer}>
          <Text>No images Found</Text>
        </Container>
      )}
    </>
  );
};

export default ImageGallery;
