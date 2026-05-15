export type TExistingImage = {
  id: number;
  url: string;
};

export type TEditImageState = {
  existingImages: TExistingImage[];
  imageIdsToRemove: number[];
};

export type TEditImageActions = {
  setExistingImages: (existingImages: TExistingImage[]) => void;
  setImageIdsToRemove: (imageIdToRemove: number) => void;
};
