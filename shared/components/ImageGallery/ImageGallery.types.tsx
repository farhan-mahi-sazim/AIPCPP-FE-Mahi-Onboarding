import { TPropertyImage } from "@/shared/redux/rtk-apis/modules/properties/properties.types";
import { TTaskImage } from "@/shared/redux/rtk-apis/modules/tasks/tasks.types";

export interface IImageGalleryProps {
  images: TPropertyImage[] | TTaskImage[];
  height?: string;
  width?: string;
}

export interface IImageGalleryStyleProps {
  height?: string;
}
