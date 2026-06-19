'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityAdd/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityAdd/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityAdd/ImgUploader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { postActivities, postActivitiesImage } from '@/lib/api/activities';
import { ActivityScheduleInput, PostActivitiesData } from '@/lib/api/activities/type';
import { showToast } from '@/utils/toast';
import { useRef, useState } from 'react';
import { getDetailFormData, validateFormField } from '../util';
import { useRouter } from 'next/navigation';

export default function ActivityAddPage() {
  const router = useRouter();
  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);

  //모달
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const detailFormData = getDetailFormData(formData);

    const schedules: ActivityScheduleInput[] =
      dateRef.current?.getValues() || ([] as ActivityScheduleInput[]);
    const bannerFile = bannerRef.current?.getValues() || [];
    const detailFiles = detailRef.current?.getValues() || [];
    const isValid = validateFormField(detailFormData, schedules, bannerFile.length);

    if (!isValid) return;

    //이미지 업로드
    const bannerUpload = await postActivitiesImage(bannerFile[0]);
    if (!bannerUpload.success) {
      showToast.error(bannerUpload.message);
      return;
    }

    const detailUploadResponse = await Promise.all(
      detailFiles.map((file) => postActivitiesImage(file))
    );
    const failedUpload = detailUploadResponse.find((res) => !res.success);
    if (failedUpload && !failedUpload.success) {
      showToast.error(failedUpload.message);
      return;
    }

    const bannerImageUrl = bannerUpload.data.activityImageUrl;
    const subImageUrls = detailUploadResponse.flatMap((res) =>
      res.success ? [res.data.activityImageUrl] : []
    );

      const { title, category, description, address, price } = detailFormData;

      //데이터 세팅
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
      setIsOpen(true);
      showToast.success('체험 등록이 완료되었습니다.');
      router.push(`/activities/${res.id}`);
    } catch {
      showToast.error('체험 등록에 실패했습니다.');
    }
    setIsOpen(true);
    showToast.success('체험 등록이 완료되었습니다.');
    //TODO: 추가된 체험으로 이동하는 로직 추가
  };
  return (
    <div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} className="min-w-80">
          <div className="flex flex-col gap-4">
            <p>체험 등록이 완료되었습니다.</p>
            <Button onClick={() => setIsOpen(false)}>확인</Button>
          </div>
        </Modal>
      )}
      <form
        className="mx-auto mb-10 flex max-w-175 grow flex-col justify-center gap-6 lg:mt-5 lg:mb-20"
        onSubmit={handleSubmit}
      >
        <div className="py-2.5 text-lg font-bold">내 체험 등록</div>
        <ExperienceDetail />
        <DateForm ref={dateRef} />
        <ImgUpload mode="banner" ref={bannerRef} />
        <ImgUpload mode="detail" ref={detailRef} />
        <Button type="submit" size="md" className="mx-auto mt-5 w-40">
          등록하기
        </Button>
      </form>
    </div>
  );
}
