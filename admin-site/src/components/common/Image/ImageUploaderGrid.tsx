import { Image, Upload, Button } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useState } from "react";
import type { UploadProps } from "antd";
import styles from "./ImageUploaderGrid.module.scss";

const MAX_IMAGES = 4;

const ImageUploaderGrid = () => {
  const [images, setImages] = useState<string[]>([]);
  const [mainImages, setMainImages] = useState<string[]>([]);

  const handleUpload: UploadProps["customRequest"] = ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (images.length < MAX_IMAGES) {
        setImages((prev) => [...prev, result]);
        onSuccess?.("ok");
      }
    };
    reader.readAsDataURL(file as File);
  };

  const handleRemoveImage = (index: number) => {
    const removedUrl = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    setMainImages((prev) => prev.filter((url) => url !== removedUrl));
  };

  const toggleMainImage = (url: string) => {
    setMainImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  return (
    <div className={styles.container}>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        accept="image/*"
        disabled={images.length >= MAX_IMAGES}
      >
        <Button
          icon={<PlusOutlined />}
          className={styles["upload-button"]}
          disabled={images.length >= MAX_IMAGES}
        >
          Upload Image
        </Button>
      </Upload>

      <div className={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${styles.cell} ${!images[i] ? styles.empty : ""}`}
          >
            {images[i] ? (
              <>
                <Image src={images[i]} alt={`Uploaded ${i + 1}`} preview />
                <CloseOutlined
                  className={styles.removeIcon}
                  onClick={() => handleRemoveImage(i)}
                />
                {mainImages.includes(images[i]) ? (
                  <StarFilled
                    className={`${styles.starIcon} ${styles.active}`}
                    onClick={() => toggleMainImage(images[i])}
                  />
                ) : (
                  <StarOutlined
                    className={styles.starIcon}
                    onClick={() => toggleMainImage(images[i])}
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

export default ImageUploaderGrid;
