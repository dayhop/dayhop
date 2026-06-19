'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityAdd/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityAdd/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityAdd/ImgUploader';
import { Button } from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { getActivity, postActivitiesImage } from '@/lib/api/activities';
import { ActivityResponse } from '@/lib/api/activities/type';
import { patchMyActivity } from '@/lib/api/my-activities';
import { PatchMyActivityRequest } from '@/lib/api/my-activities/type';
import { showToast } from '@/utils/toast';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { getDetailFormData, getImgCurrnet, handleIsEdited, validateFormField } from '../../util';
import { useRouter } from 'next/navigation';

interface EditPageProps {
  params: Promise<{ id: number }>;
}
export default function ActivityEditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initData, setInitData] = useState<ActivityResponse>();

  const bannerInitialUrls = useMemo(
    () => (initData?.bannerImageUrl ? [initData.bannerImageUrl] : undefined),
    [initData]
  );
  const detailInitialUrls = useMemo(
    () => initData?.subImages?.map((img) => img.imageUrl),
    [initData]
  );

  const handleSubmit = async () => {
    if (!initData) return;
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);

    //detail에 있는 거 가져옴
    const detailFormData = getDetailFormData(formData);

    //유효성 검사를 위한 배너 이미지와 스케줄 가져오기
    const bannerImageCount = bannerRef.current?.getCurrentUrls?.().length ?? 0;
    const schedules = dateRef.current?.getValues?.() || [];

    //배너, 디테일 현재 가져오기
    const imgCurrnet = getImgCurrnet(bannerRef, detailRef);
    const { bannerFile, detailFiles } = imgCurrnet;

    //유효성 검사
    const isValid = validateFormField(
      detailFormData.title,
      detailFormData.category,
      detailFormData.description,
      detailFormData.address,
      detailFormData.price,
      schedules,
      bannerImageCount
    );

    //유효하지 않는다면 종료
    if (!isValid) return;

    //================================

    try {
      //배너 업로드
      const bannerImageUrl =
        bannerFile.length > 0
          ? (await postActivitiesImage(bannerFile[0])).activityImageUrl
          : initData.bannerImageUrl;

      //디테일 파일 업로드
      const detailUploadPromise = detailFiles.map((file) => postActivitiesImage(file));
      const detailUploadResponse = await Promise.all(detailUploadPromise);

      //add와 diff
      const subImageUrlsToAdd = detailUploadResponse.map((r) => r.activityImageUrl);
      const currentDetailUrls = detailRef.current?.getCurrentUrls?.() ?? [];
      const subImageIdsToRemove = initData.subImages
        .filter((img) => !currentDetailUrls.includes(img.imageUrl))
        .map((img) => img.id);

      // 스케줄
      const schedulesToAdd = schedules.filter(
        (s) =>
          initData.schedules.findIndex(
            (init) =>
              init.date === s.date && init.startTime === s.startTime && init.endTime === s.endTime
          ) === -1
      );

      const scheduleIdsToRemove = initData.schedules
        .filter(
          (init) =>
            schedules.findIndex(
              (s) =>
                s.date === init.date && s.startTime === init.startTime && s.endTime === init.endTime
            ) === -1
        )
        .map((init) => init.id);

      //데이터 세팅
      const submitData: PatchMyActivityRequest = {
        ...detailFormData,
        bannerImageUrl,
        subImageIdsToRemove,
        subImageUrlsToAdd,
        scheduleIdsToRemove,
        schedulesToAdd,
      };

      //수정 사항이 있는지 확인
      const isEdited = handleIsEdited(
        detailFormData,
        initData,
        subImageIdsToRemove,
        subImageUrlsToAdd,
        scheduleIdsToRemove,
        schedulesToAdd,
        bannerImageUrl
      );
      if (!isEdited) {
        setIsOpen(false);
        return showToast.error('수정 사항이 없습니다.');
      }

      await patchMyActivity(id, submitData);
      setIsOpen(false);
      showToast.success('체험 수정이 완료되었습니다.');
      router.back();
    } catch {
      showToast.error('체험 수정에 실패했습니다.');
    }
  };

  //화면에 마운트 되자마자 초기데이터를 가져옴
  useEffect(() => {
    const getInitData = async () => {
      try {
        const response = await getActivity(id);
        setInitData(response ?? undefined);
      } catch (error) {
        console.error(error);
      }
    };
    getInitData();
  }, [id]);

  return (
    <div>
      {isOpen && (
        <ConfirmModal
          onConfirm={handleSubmit}
          onClose={() => setIsOpen(false)}
          message="이대로 수정하시겠습니까?"
          isOpen={isOpen}
        />
      )}
      <form ref={formRef} className="flex flex-col justify-center gap-6">
        <div className="py-2.5 text-lg font-bold">내 체험 수정</div>
        <ExperienceDetail data={initData} key={initData?.id || 'loading'} />
        <DateForm ref={dateRef} data={initData} />
        <ImgUpload mode="banner" ref={bannerRef} initialUrls={bannerInitialUrls} />
        <ImgUpload mode="detail" ref={detailRef} initialUrls={detailInitialUrls} />
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          size="md"
          className="mx-auto mt-5 w-40"
        >
          수정하기
        </Button>
      </form>
    </div>
  );
}
