import ImgAddIcon from '@/assets/icon/ImgAddIcon.svg';
import { showToast } from '@/utils/toast';
import { ChangeEvent } from 'react';

interface UploadImgProp {
  onFileSelect: (file: File) => void;
}

export function UploadImg({ onFileSelect }: UploadImgProp) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <label className="border-bg-footer flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border md:h-32 md:w-32">
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <ImgAddIcon />
      <div className="text-text-tertiary hidden text-sm md:flex">file Upload</div>
    </label>
  );
}
