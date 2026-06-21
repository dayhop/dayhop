'use client';

import { ImgLimit } from '@/components/ui/ActivityAdd/ImgLimit';
import { PreviewImg } from '@/components/ui/ActivityAdd/PreviewImg';
import { UploadImg } from '@/components/ui/ActivityAdd/UploadImg';
import { showToast } from '@/utils/toast';
import { Ref, useEffect, useImperativeHandle, useState } from 'react';

interface ImageItem {
  id: string;
  url: string;
  file?: File;
}

interface ImgUploadProps {
  mode: 'banner' | 'detail';
  initialUrls?: string[];
  ref?: Ref<ImgUploadRef>;
}

export interface ImgUploadRef {
  getValues: () => File[];
  getCurrentUrls?: () => string[];
}

export function ImgUpload({ mode, ref, initialUrls }: ImgUploadProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const LIMIT = mode === 'banner' ? 1 : 4;

  useEffect(() => {
    const imageToObjects = () => {
      if (initialUrls) {
        setImages(initialUrls.map((url) => ({ id: crypto.randomUUID(), url })));
      }
    };
    imageToObjects();
  }, [initialUrls]);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => images.filter((img) => !!img.file).map((img) => img.file!),
      getCurrentUrls: () => images.map((img) => img.url),
    }),
    [images]
  );

  const handleFileSelect = (newFile: File) => {
    const isDuplicate = images.some(
      (img) => img.file?.name === newFile.name && img.file?.size === newFile.size
    );
    if (isDuplicate) {
      showToast.error('이미 추가된 이미지 입니다.');
      return;
    }
    const newImage: ImageItem = {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(newFile),
      file: newFile,
    };
    setImages((prev) => [...prev, newImage]);
  };

  const handleDelete = (id: string) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (imageToDelete?.file) {
      URL.revokeObjectURL(imageToDelete.url);
    }
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center font-bold">
        {mode === 'banner' ? '배너 이미지 등록' : '소개 이미지 등록'}
        <ImgLimit type={mode} currentAdd={images.length} />
      </div>
      <div className="flex gap-3">
        {images.length < LIMIT && <UploadImg onFileSelect={handleFileSelect} />}
        {images.map((image) => (
          <PreviewImg
            key={image.id}
            imgUrl={image.url}
            onClickDeleteButton={() => handleDelete(image.id)}
          />
        ))}
      </div>
    </div>
  );
}
