import { Image, Upload, Button, Spin } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  StarOutlined,
  StarFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type { UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";

import styles from "./ImageUploaderGrid.module.scss";
import type {
  ImageItem,
  ImageMetadata,
  ImageUpdateGridProps,
  ImageUploaderGridRef,
} from "../../../type/menu/menu";

const MAX_IMAGES = 4;

const ImageUpdateGrid = forwardRef<ImageUploaderGridRef, ImageUpdateGridProps>(
  ({ initialImages = [], onUploadAllClick, isUploadingImages }, ref) => {
    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
      if (initialImages.length > 0 && images.length === 0) {
        setImages(
          initialImages.map((img) => ({
            id: img.id || uuidv4(),
            url: img.url,
            file: null,
            preview: img.url,
            isMain: img.is_main,
            isDeleted: false,
            isNew: false,
          }))
        );
      }
    }, [initialImages, images]);

    useImperativeHandle(ref, () => ({
      getImagesDataForUpload: () => {
        const filesToUpload: File[] = [];
        const metadata: ImageMetadata[] = [];

        images.forEach((img) => {
          if (img.isNew && !img.isDeleted) {
            filesToUpload.push(img.file!);
            metadata.push({
              id: null,
              is_main: img.isMain,
              is_deleted: false,
            });
          } else if (!img.isNew) {
            metadata.push({
              id: img.id,
              is_main: img.isMain,
              is_deleted: img.isDeleted,
            });
          }
        });

        return { files: filesToUpload, metadata: metadata };
      },
      hasChanges: () => {
        const newImagesExist = images.some(
          (img) => img.isNew && !img.isDeleted
        );

        const existingImagesModified = images.some((img) => {
          if (img.isNew) return false;
          const initial = initialImages.find(
            (i) => i.id === img.id || i.url === img.url
          );
          return img.isDeleted || (initial && initial.is_main !== img.isMain);
        });
        return newImagesExist || existingImagesModified;
      },
    }));

    const handleUpload: UploadProps["customRequest"] = ({
      file,
      onSuccess,
    }) => {
      const currentVisibleImages = images.filter((img) => !img.isDeleted);
      if (currentVisibleImages.length < MAX_IMAGES) {
        const previewUrl = URL.createObjectURL(file as File);
        const newImageItem: ImageItem = {
          id: uuidv4(),
          url: null,
          file: file as File,
          preview: previewUrl,
          isMain: false,
          isDeleted: false,
          isNew: true,
        };
        const updatedImages = [...images, newImageItem];
        if (updatedImages.filter((img) => !img.isDeleted).length === 1) {
          newImageItem.isMain = true;
        } else if (
          updatedImages.filter((img) => img.isMain && !img.isDeleted).length ===
          0
        ) {
          newImageItem.isMain = true;
        }

        setImages(updatedImages);
        onSuccess?.("ok");
      }
    };

    const handleRemoveImage = (imageId: string) => {
      setImages((prev) => {
        let hasMainImage = false;
        let firstNonDeletedImageId: string | null = null;

        const updatedImages = prev
          .map((img) => {
            if (img.id === imageId) {
              if (img.isNew) {
                URL.revokeObjectURL(img.preview);
                return null;
              } else {
                return { ...img, isDeleted: true, isMain: false };
              }
            }
            return img;
          })
          .filter(Boolean) as ImageItem[];

        updatedImages.forEach((img) => {
          if (!img.isDeleted) {
            if (img.isMain) {
              hasMainImage = true;
            }
            if (!firstNonDeletedImageId) {
              firstNonDeletedImageId = img.id;
            }
          }
        });

        if (!hasMainImage && firstNonDeletedImageId) {
          return updatedImages.map((img) =>
            img.id === firstNonDeletedImageId ? { ...img, isMain: true } : img
          );
        }

        return updatedImages;
      });
    };

    const toggleMainImage = (imageId: string) => {
      setImages((prev) =>
        prev.map((img) => {
          if (img.id === imageId) {
            return { ...img, isMain: !img.isMain };
          } else {
            return { ...img, isMain: false };
          }
        })
      );
    };

    const displayedImages = images.filter((img) => !img.isDeleted);

    const handleUploadAllImages = () => {
      if (onUploadAllClick) {
        const { files, metadata } = (
          ref as React.RefObject<ImageUploaderGridRef>
        )?.current?.getImagesDataForUpload() || { files: [], metadata: [] };
        onUploadAllClick(files, metadata);
      }
    };

    return (
      <Spin
        spinning={isUploadingImages}
        indicator={<LoadingOutlined spin />}
        size="large"
      >
        <div className={styles.container}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
              disabled={displayedImages.length >= MAX_IMAGES}
            >
              <Button
                icon={<PlusOutlined />}
                className={styles["upload-button"]}
                disabled={displayedImages.length >= MAX_IMAGES}
              >
                Upload Image
              </Button>
            </Upload>
            <Button
              onClick={handleUploadAllImages}
              disabled={
                !images.some(
                  (img) =>
                    img.isNew ||
                    img.isDeleted ||
                    (() => {
                      const initial = initialImages.find(
                        (i) => i.id === img.id || i.url === img.url
                      );
                      return initial && initial.is_main !== img.isMain;
                    })()
                )
              }
              type="primary"
            >
              Save Changes
            </Button>
          </div>
          <div className={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={displayedImages[i]?.id || i}
                className={`${styles.cell} ${
                  !displayedImages[i] ? styles.empty : ""
                }`}
              >
                {displayedImages[i] ? (
                  <>
                    <Image
                      src={displayedImages[i].preview}
                      alt={`Uploaded ${i + 1}`}
                      preview
                    />
                    <CloseOutlined
                      className={styles.removeIcon}
                      onClick={() => handleRemoveImage(displayedImages[i].id!)}
                    />
                    {displayedImages[i].isMain ? (
                      <StarFilled
                        className={`${styles.starIcon} ${styles.active}`}
                        onClick={() => toggleMainImage(displayedImages[i].id!)}
                      />
                    ) : (
                      <StarOutlined
                        className={styles.starIcon}
                        onClick={() => toggleMainImage(displayedImages[i].id!)}
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
      </Spin>
    );
  }
);

export default ImageUpdateGrid;
