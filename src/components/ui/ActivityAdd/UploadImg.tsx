import ImgAddIcon from '@/assets/icon/ImgAddIcon.svg';

interface UploadImgProp {
  onClickImgUpload: () => void;
}

export function UploadImg({ onClickImgUpload }: UploadImgProp) {
  return (
    <label
      className="border-bg-footer flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border md:h-32 md:w-32"
      onClick={onClickImgUpload}
    >
      <input type="file" className="hidden" />
      <ImgAddIcon />
      <div className="text-text-tertiary hidden text-sm md:flex">file Upload</div>
    </label>
  );
}
