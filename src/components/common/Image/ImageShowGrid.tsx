import { Image } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import styles from "./ImageUploaderGrid.module.scss";

export interface DisplayImage {
  url: string;
  is_main: boolean;
  uid?: string;
}

interface ImageShowGridProps {
  initialImages: DisplayImage[];
}

const MAX_DISPLAY_SLOTS = 4;

const ImageShowGrid = ({ initialImages }: ImageShowGridProps) => {
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);

  useEffect(() => {
    const processedImages = initialImages?.map((img, index) => ({
      ...img,
      uid: img.uid || `image-${index}-${Date.now()}`,
    }));
    setDisplayImages(processedImages);
  }, [initialImages]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {[...Array(MAX_DISPLAY_SLOTS)].map((_, i) => (
          <div
            key={displayImages[i]?.uid || `empty-${i}`}
            className={`${styles.cell} ${
              !displayImages[i] ? styles.empty : ""
            }`}
          >
            {displayImages[i] ? (
              <>
                <Image
                  src={displayImages[i].url}
                  alt={`Image ${i + 1}`}
                  preview
                />
                {displayImages[i].is_main && (
                  <StarFilled
                    className={`${styles.starIcon} ${styles.active}`}
                  />
                )}
              </>
            ) : (
              "Empty"
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageShowGrid;
