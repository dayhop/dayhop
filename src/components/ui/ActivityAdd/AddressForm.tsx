import { useState } from 'react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import Input from '../Input';
import { Modal } from '../Modal';
import { Button } from '../Button';
import IconClose from '@/assets/icon/icon-close.svg';

interface AddressFormProps {
  defaultValue?: string;
}

export default function AddressForm({ defaultValue }: AddressFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [addressData, setAddressData] = useState(defaultValue || '');
  const handleComplete = (data: Address) => {
    setAddressData(data.address);
    setIsOpen(false);
  };

  return (
    <div className="flex w-full gap-3">
      <Input
        value={addressData}
        name="address"
        readOnly
        placeholder="버튼을 클릭해 주소를 찾아주세요."
      />
      <Button type="button" onClick={() => setIsOpen(true)} className="w-40 shrink-0 text-sm">
        우편번호 찾기
      </Button>
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          ariaLabel="우편번호 찾기"
          className="relative w-[500px] max-w-[calc(100vw-32px)]"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="닫기"
            className="absolute top-6 right-6 cursor-pointer"
          >
            <IconClose className="h-6 w-6" />
          </button>
          <h2 className="pb-4 text-xl font-bold">주소 검색</h2>
          <div className="h-[50vh] min-h-[400px] w-full">
            <DaumPostcodeEmbed onComplete={handleComplete} onClose={() => setIsOpen(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
}
