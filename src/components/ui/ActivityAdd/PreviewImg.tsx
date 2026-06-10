import Image from 'next/image';

import Delete from '@/assets/icon/Delete.svg';

export function PreviewImg({
  imgUrl,
  onClickDeleteButton,
}: {
  imgUrl: string;
  onClickDeleteButton: () => void;
}) {
  return (
    <div className="relative h-20 w-20 md:h-32 md:w-32">
      <Image src={imgUrl} alt="이미지 미리보기" fill className="rounded-2xl object-cover" />
      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2">
        <DeleteImgButton onClickDeleteButton={onClickDeleteButton} />
      </div>
    </div>
  );
}

function DeleteImgButton({ onClickDeleteButton }: { onClickDeleteButton: () => void }) {
  return (
    <button
      onClick={onClickDeleteButton}
      type="button"
      className="bg-text-primary active:bg-text-secondary flex h-5 w-5 cursor-pointer items-center justify-center rounded-full md:h-6.5 md:w-6.5"
    >
      <Delete />
    </button>
  );
}
