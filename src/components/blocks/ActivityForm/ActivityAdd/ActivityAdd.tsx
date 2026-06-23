'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityForm/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityForm/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityForm/ImgUploader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { postActivities } from '@/lib/api/activities';
import { ActivityScheduleInput, PostActivitiesData } from '@/lib/api/activities/type';
import { showToast } from '@/utils/toast';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDetailFormData, validateFormField } from '@/utils/ActivityForm/util';
import { uploadActivityImages } from '@/utils/ActivityForm/ImageUpload';

export function ActivityAdd() {
  const router = useRouter();
  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);

  //모달
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activityId, setActivityId] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);

    const detailFormData = getDetailFormData(formData);

    const schedules: ActivityScheduleInput[] =
      dateRef.current?.getValues() || ([] as ActivityScheduleInput[]);
    const bannerFile = bannerRef.current?.getValues() || [];
    const detailFiles = detailRef.current?.getValues() || [];

    const isValid = validateFormField(detailFormData, schedules, bannerFile.length);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const ImgUpload = await uploadActivityImages(bannerFile, detailFiles);

      if (!ImgUpload.success) {
        showToast.error(ImgUpload.message || '');
        setIsSubmitting(false);
        return;
      }

      const { bannerImageUrl, subImageUrls } = ImgUpload.data!;
      const { title, category, description, address, price } = detailFormData;

      const submitData: PostActivitiesData = {
        title,
        category,
        description,
        address,
        price,
        schedules: schedules as ActivityScheduleInput[],
        bannerImageUrl,
        subImageUrls,
      };

      const res = await postActivities(submitData);
      if (!res.success) {
        showToast.error(res.message);
        setIsSubmitting(false);
        return;
      }
      setIsOpen(true);
      setActivityId(res.data.id);
    } catch {
      showToast.error('체험 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} className="min-w-80">
          <div className="flex flex-col gap-4">
            <p>체험 등록이 완료되었습니다.</p>
            <Button
              onClick={() => {
                setIsOpen(false);
                router.push(`/activities/${activityId}`);
              }}
            >
              확인
            </Button>
          </div>
        </Modal>
      )}
      <form
        className="mx-auto mb-10 flex w-full max-w-175 grow flex-col justify-center gap-6 px-4 lg:mt-5 lg:mb-20"
        onSubmit={handleSubmit}
      >
        <div className="py-2.5 text-lg font-bold">내 체험 등록</div>
        <ExperienceDetail />
        <DateForm ref={dateRef} />
        <ImgUpload mode="banner" ref={bannerRef} />
        <ImgUpload mode="detail" ref={detailRef} />
        <Button type="submit" size="md" className="mx-auto mt-5 w-40" isLoading={isSubmitting}>
          등록하기
        </Button>
      </form>
    </div>
  );
}
