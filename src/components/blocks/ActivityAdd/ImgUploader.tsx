'use client';

import { PreviewImg } from '@/components/ui/ActivityAdd/PreviewImg';
import { UploadImg } from '@/components/ui/ActivityAdd/UploadImg';
import { Ref, useImperativeHandle, useState } from 'react';

interface ImgUploadProps {
  mode: 'banner' | 'detail';
  ref?: Ref<ImgUploadRef>;
}

export interface ImgUploadRef {
  getValues: () => File[];
}

export function ImgUpload({ mode, ref }: ImgUploadProps) {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const LIMIT = mode === 'banner' ? 1 : 4;

  useImperativeHandle(ref, () => ({
    getValues: () => imgFiles,
  }));

  return (
    <div className="flex flex-col gap-2.5">
      <div>{mode === 'banner' ? '배너 이미지 등록' : '소개 이미지 등록'}</div>
      <div className="flex gap-3">
        {imgFiles.length < LIMIT && (
          <UploadImg onFileSelect={(newFile: File) => setImgFiles((prev) => [...prev, newFile])} />
        )}
        {imgFiles.length > 0 &&
          imgFiles.map((file, index) => {
            const imgPreview = URL.createObjectURL(file);
            return (
              <PreviewImg
                key={`${file.name}-${index}`}
                imgUrl={imgPreview}
                onClickDeleteButton={() =>
                  setImgFiles((prev) => prev.filter((item) => item !== file))
                }
              />
            );
          })}
      </div>
    </div>
  );
}
