'use client';

import { DateForm, DateFormRef } from '@/components/blocks/ActivityForm/DateForm';
import { ExperienceDetail } from '@/components/blocks/ActivityForm/ExperienceDetails';
import { ImgUpload, ImgUploadRef } from '@/components/blocks/ActivityForm/ImgUploader';
import { Button } from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { getActivity, postActivitiesImage } from '@/lib/api/activities';
import { ActivityResponse } from '@/lib/api/activities/type';
import { patchMyActivity } from '@/lib/api/my-activities';
import { PatchMyActivityRequest } from '@/lib/api/my-activities/type';
import { showToast } from '@/utils/toast';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getDetailFormData,
  getImgCurrnet,
  handleIsEdited,
  validateFormField,
} from '@/utils/ActivityForm/util';
import { findRemove } from '@/utils/ActivityForm/ImageUpload';
import { ResetButton } from './ResetButton';

interface EditPageProps {
  activityId: number;
}
export function ActivityEdit({ activityId }: EditPageProps) {
  const router = useRouter();

  const observerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initData, setInitData] = useState<ActivityResponse>();
  const [resetKey, setResetKey] = useState(0);
  const [resetButtonBottom, setResetButtonBottom] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dateRef = useRef<DateFormRef>(null);
  const bannerRef = useRef<ImgUploadRef>(null);
  const detailRef = useRef<ImgUploadRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const bannerInitialUrls = useMemo(
    () => (initData?.bannerImageUrl ? [initData.bannerImageUrl] : undefined),
    [initData]
  );
  const detailInitialUrls = useMemo(
    () => initData?.subImages?.map((img) => img.imageUrl),
    [initData]
  );

  useEffect(() => {
    const getInitData = async () => {
      const res = await getActivity(activityId);
      if (res.success) setInitData(res.data);
    };
    getInitData();
  }, [activityId]);

  const handleSubmit = async () => {
    if (!initData) return;
    if (!formRef.current) {
      return;
    }
    if (isSubmitting) return;

    const formData = new FormData(formRef.current);

    //유저가 입력한 form 취합
    const detailFormData = getDetailFormData(formData);
    const schedules = dateRef.current?.getValues?.() || [];
    const imgCurrnet = getImgCurrnet(bannerRef, detailRef);
    const { bannerFile, detailFiles } = imgCurrnet;

    //유효성 검사
    const bannerCurrentCount = bannerRef.current?.getCurrentUrls?.()?.length ?? 0;
    const isValid = validateFormField(detailFormData, schedules, bannerCurrentCount);

    //유효하지 않는다면 종료
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      //================================

      // 배너: 새 파일이 있으면 업로드, 없으면 기존 URL 유지
      let bannerImageUrl: string;
      if (bannerFile.length > 0) {
        const bannerUpload = await postActivitiesImage(bannerFile[0]);
        if (!bannerUpload.success) {
          showToast.error(bannerUpload.message);
          return;
        }
        bannerImageUrl = bannerUpload.data.activityImageUrl;
      } else {
        bannerImageUrl = initData.bannerImageUrl;
      }

      // 디테일: 새로 추가된 파일만 업로드
      const detailUploadRes = await Promise.all(
        detailFiles.map((file) => postActivitiesImage(file))
      );
      const detailFailed = detailUploadRes.find((r) => !r.success);
      if (detailFailed && !detailFailed.success) {
        showToast.error(detailFailed.message);
        return;
      }
      const subImageUrls = detailUploadRes.flatMap((r) =>
        r.success ? [r.data.activityImageUrl] : []
      );

      //add와 diff
      const subImageIdsToRemove = findRemove(detailRef, initData);
      const schedulesToAdd =
        schedules.filter(
          (s) =>
            initData.schedules.findIndex(
              (init) =>
                init.date === s.date && init.startTime === s.startTime && init.endTime === s.endTime
            ) === -1
        ) || [];

      const scheduleIdsToRemove =
        initData.schedules
          .filter(
            (init) =>
              schedules.findIndex(
                (s) =>
                  s.date === init.date &&
                  s.startTime === init.startTime &&
                  s.endTime === init.endTime
              ) === -1
          )
          .map((init) => init.id) || [];

      //데이터 세팅
      const submitData: PatchMyActivityRequest = {
        ...detailFormData,
        bannerImageUrl,
        subImageIdsToRemove,
        subImageUrlsToAdd: subImageUrls,
        scheduleIdsToRemove,
        schedulesToAdd,
      };

      //수정 사항이 있는지 확인
      const isEdited = handleIsEdited(
        detailFormData,
        initData,
        subImageIdsToRemove,
        subImageUrls,
        scheduleIdsToRemove,
        schedulesToAdd,
        bannerImageUrl
      );
      if (!isEdited) {
        setIsOpen(false);
        showToast.error('수정 사항이 없습니다.');
        return;
      }

      const patchRes = await patchMyActivity(activityId, submitData);
      if (!patchRes.success) {
        showToast.error(patchRes.message);
        return;
      }
      setIsOpen(false);
      showToast.success('체험 수정이 완료되었습니다.');
      router.refresh();
      router.back();
    } catch {
      showToast.error('체험 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setResetButtonBottom(120);
        } else {
          setResetButtonBottom(30);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="">
      {isOpen && (
        <ConfirmModal
          onConfirm={handleSubmit}
          onClose={() => setIsOpen(false)}
          message="이대로 수정하시겠습니까?"
          isOpen={isOpen}
          isLoading={isSubmitting}
        />
      )}
      <ResetButton onReset={handleReset} resetButtonBottom={resetButtonBottom} />
      <form
        ref={formRef}
        className="mx-auto mt-5 mb-10 flex w-full max-w-187 grow flex-col justify-center gap-6 px-6 lg:mt-5 lg:mb-20"
        key={resetKey}
      >
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
      <div ref={observerRef} />
    </div>
  );
}
