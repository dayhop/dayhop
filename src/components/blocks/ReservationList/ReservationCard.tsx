import Image from 'next/image';

interface ReservationCardProps {
  title: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  //TODO 타입 수정
  status: string;
  headCount: number;
  bannerImageUrl: string;
}
export function ReservationCard({
  title,
  startTime,
  endTime,
  totalPrice,
  status,
  headCount,
  bannerImageUrl,
}: ReservationCardProps) {
  const totalPriceToString = (totalPrice: number) => {
    const price = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return price + '원';
  };

  return (
    <div className="flex h-37 items-stretch">
      <div className="relative z-10 flex w-fit flex-col justify-end gap-2 rounded-3xl bg-white p-5 text-sm shadow-[0_-8px_20px_0_rgba(0,0,0,0.05)]">
        <div>{status}</div>
        <div className="flex flex-col gap-1">
          <div className="font-bold">{title}</div>
          <div className="text-[13px] text-gray-500">
            {startTime} ~ {endTime}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="text-[16px] font-bold">{totalPriceToString(totalPrice)}</div>
          <div className="text-gray-400">{headCount}명</div>
        </div>
      </div>
      <div className="relative -ml-5 aspect-square overflow-hidden rounded-r-3xl">
        <Image src={bannerImageUrl} alt="배너 이미지" fill className="object-cover" />
      </div>
    </div>
  );
}
