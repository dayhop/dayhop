'use client';

import { PreviewImg } from '@/components/ui/ActivityAdd/PreviewImg';
import { UploadImg } from '@/components/ui/ActivityAdd/UploadImg';
import { useState } from 'react';

interface ImgUploadProps {
  mode: 'banner' | 'detail';
}

export function ImgUpload({ mode }: ImgUploadProps) {
  const [imgList, setImgList] = useState<string[]>([]);
  const LIMIT = mode === 'banner' ? 1 : 4;

  return (
    <div className="flex flex-col gap-2.5">
      <div>{mode === 'banner' ? '배너 이미지 등록' : '소개 이미지 등록'}</div>
      <div className="flex gap-3">
        {imgList.length < LIMIT && (
          <UploadImg onFileSelect={(newImg: string) => setImgList((prev) => [...prev, newImg])} />
        )}
        {imgList.length > 0 &&
          imgList.map((img) => (
            <PreviewImg
              key={img}
              imgUrl={img}
              onClickDeleteButton={() => setImgList((prev) => prev.filter((item) => item !== img))}
            />
          ))}
      </div>
    </div>
  );
}
