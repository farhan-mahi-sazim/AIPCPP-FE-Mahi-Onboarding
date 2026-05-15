import { createStyles } from "@mantine/core";

export const useImageGalleryHorizontalStyles = createStyles(() => ({
  galleryContainer: {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
  },
  imageContainer: {
    position: "relative",
    flex: "0 0 10em",
    marginRight: "1em",
  },
  closeButton: {
    position: "absolute",
    top: "0.1em",
    right: "0.1em",
    zIndex: 10,
    color: "red",
    padding: "0.2em",
    background: "transparent",
    fontSize: "1.2em",
  },
}));
