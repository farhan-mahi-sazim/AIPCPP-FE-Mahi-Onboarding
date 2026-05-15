export type TImageGalleryHorizontalProps = {
  files: File[];
  canDelete?: boolean;
  onRemove?: (index: number) => void;
};
