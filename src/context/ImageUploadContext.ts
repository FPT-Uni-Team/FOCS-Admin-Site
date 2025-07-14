import { createContext, useContext } from "react";

export interface ImageFile extends File {
  preview?: string;
}

interface ImageUploadContextType {
  images: ImageFile[];
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  mainImages: boolean[];
  setMainImages: React.Dispatch<React.SetStateAction<boolean[]>>;
}
export const ImageUploadContext = createContext<ImageUploadContextType | null>(
  null
);

export const useImageUpload = () => {
  const context = useContext(ImageUploadContext);
  if (!context) throw new Error("useImageUpload must be used within Provider");
  return context;
};
