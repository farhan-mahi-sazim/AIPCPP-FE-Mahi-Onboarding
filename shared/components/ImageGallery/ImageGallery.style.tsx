import { createStyles } from "@/shared/utils/createStyles";

import { IImageGalleryStyleProps } from "./ImageGallery.types";

export const useImageGalleryStyle = createStyles((_theme, { height }: IImageGalleryStyleProps) => ({
  noImagesContainer: {
    maxWidth: "90vw",
    display: "flex",
    alignItems: "center",
    margin: "0",
    padding: "0",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    minHeight: "10em",

    "@media (orientation: portrait)": {
      minWidth: "90vw",
    },
  },

  modal: {
    background: "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  fullscreenImage: {
    width: "100%",
    objectFit: "contain",
  },

  galleryContainer: {
    margin: "0",
    padding: "0",
    marginTop: "1em",
    maxWidth: "90vw",
  },

  imageCarouselContainer: {
    padding: "0",
    display: "flex",
    margin: "0",
    overflowX: "auto",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
  },

  image: {
    objectFit: "cover",
    height: "4em",
    width: "6em",
    margin: "0.1em",
    cursor: "pointer",
  },

  selectedImage: {
    objectFit: "cover",
    height: height ?? "30em",
    width: "100%",
    margin: "0.1em",
    transition: "transform 0.2s ease-in-out",

    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.02)",
      transition: "transform 0.2s ease-in-out",
    },
    "@media (orientation: portrait)": {
      height: "20em",
    },
  },

  unselectedImage: {
    filter: "brightness(0.6)",

    "&:hover": {
      filter: "brightness(0.8)",
      cursor: "pointer",
    },
  },
}));
