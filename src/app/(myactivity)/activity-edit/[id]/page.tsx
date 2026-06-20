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
    const isValid = validateFormField(detailFormData, schedules, bannerImageCount);

    //유효하지 않는다면 종료
    if (!isValid) return;

    //================================

    //배너 업로드
    let bannerImageUrl = initData.bannerImageUrl;
    if (bannerFile.length > 0) {
      const bannerRes = await postActivitiesImage(bannerFile[0]);
      if (!bannerRes.success) {
        showToast.error(bannerRes.message);
        return;
      }
      bannerImageUrl = bannerRes.data.activityImageUrl;
    }

    //디테일 파일 업로드
    const detailUploadResponse = await Promise.all(
      detailFiles.map((file) => postActivitiesImage(file))
    );
    const failedUpload = detailUploadResponse.find((r) => !r.success);
    if (failedUpload && !failedUpload.success) {
      showToast.error(failedUpload.message);
      return;
    }

    //add와 diff
    const subImageUrlsToAdd = detailUploadResponse.flatMap((r) =>
      r.success ? [r.data.activityImageUrl] : []
    );
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
      showToast.error('수정 사항이 없습니다.');
      return;
    }

    const patchRes = await patchMyActivity(id, submitData);
    if (!patchRes.success) {
      showToast.error(patchRes.message);
      return;
    }
    setIsOpen(false);
    showToast.success('체험 수정이 완료되었습니다.');
    router.refresh();
    router.back();
  };

  //화면에 마운트 되자마자 초기데이터를 가져옴
  useEffect(() => {
    const getInitData = async () => {
      const res = await getActivity(id);
      if (res.success) setInitData(res.data);
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
      <form
        ref={formRef}
        className="mx-auto mb-10 flex max-w-175 grow flex-col justify-center gap-6 lg:mt-5 lg:mb-20"
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
    </div>
  );
}
