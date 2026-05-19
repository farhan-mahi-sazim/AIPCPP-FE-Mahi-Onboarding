import { createContext, PropsWithChildren, useCallback, useState } from "react";

import { TEditImageActions, TEditImageState, TExistingImage } from "./EditImages.types";

const initialEditImagesState: TEditImageState = {
  existingImages: [],
  imageIdsToRemove: [],
};

export const EditImagesContext = createContext<{
  state: TEditImageState;
  actions: TEditImageActions;
}>({
  state: initialEditImagesState,
  actions: {
    setExistingImages: () => {},
    setImageIdsToRemove: () => {},
  },
});

const EditImagesContextProvider = ({ children }: PropsWithChildren) => {
  const [EditImagesState, setEditImagesState] = useState<TEditImageState>(initialEditImagesState);

  const setExistingImages: TEditImageActions["setExistingImages"] = useCallback(
    (images: TExistingImage[]) => {
      setEditImagesState((prevState) => ({
        ...prevState,
        existingImages: images,
      }));
    },
    [],
  );

  const setImageIdsToRemove: TEditImageActions["setImageIdsToRemove"] = (id: number) => {
    setEditImagesState((prevState) => ({
      ...prevState,
      imageIdsToRemove: [...prevState.imageIdsToRemove, id],
      existingImages: prevState.existingImages.filter((image) => image.id !== id),
    }));
  };

  return (
    <EditImagesContext.Provider
      value={{
        state: EditImagesState,
        actions: { setExistingImages, setImageIdsToRemove },
      }}
    >
      {children}
    </EditImagesContext.Provider>
  );
};

export default EditImagesContextProvider;
