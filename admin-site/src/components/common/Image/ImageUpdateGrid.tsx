import { Image, Upload, Button } from "antd";

import {
  PlusOutlined,
  CloseOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";

import { useEffect } from "react";

import type { UploadProps } from "antd";

import styles from "./ImageUploaderGrid.module.scss";

import {
  useImageUpload,
  type ImageFile,
} from "../../../context/ImageUploadContext";

const MAX_IMAGES = 4;

const ImageUpdateGrid = () => {
  const { images, setImages, mainImages, setMainImages } = useImageUpload();
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.preview as string));
    };
  }, [images]);

  const handleUpload: UploadProps["customRequest"] = ({ file, onSuccess }) => {
    if (images.length < MAX_IMAGES) {
      const previewUrl = URL.createObjectURL(file as File);
      const newImageFile = Object.assign(file as File, {
        preview: previewUrl,
      }) as ImageFile;
      setImages((prev) => [...prev, newImageFile]);
      setMainImages((prev) => [...prev, false]);
      onSuccess?.("ok");
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview as string);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setMainImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleMainImage = (index: number) => {
    setMainImages((prev) =>
      prev.map((value, i) => (i === index ? !value : value))
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
                <Image
                  src={images[i].preview}
                  alt={`Uploaded ${i + 1}`}
                  preview
                />
                <CloseOutlined
                  className={styles.removeIcon}
                  onClick={() => handleRemoveImage(i)}
                />
                {mainImages[i] ? (
                  <StarFilled
                    className={`${styles.starIcon} ${styles.active}`}
                    onClick={() => toggleMainImage(i)}
                  />
                ) : (
                  <StarOutlined
                    className={styles.starIcon}
                    onClick={() => toggleMainImage(i)}
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

export default ImageUpdateGrid;
