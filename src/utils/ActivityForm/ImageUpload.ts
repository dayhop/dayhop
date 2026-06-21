import { ImgUploadRef } from '@/components/blocks/ActivityForm/ImgUploader';
import { postActivitiesImage } from '@/lib/api/activities';
import { ActivityResponse, PostActivitiesImageResponse } from '@/lib/api/activities/type';
import { RefObject } from 'react';

export const uploadActivityImages = async (banner: File[], details: File[]) => {
  const bannerUpload = await postActivitiesImage(banner[0]);

  if (!bannerUpload.success) {
    return { success: false, message: bannerUpload.message };
  }
  const detailUploadRes = await Promise.all(details.map((file) => postActivitiesImage(file)));
  const detailUploadFailed = detailUploadRes.find((r) => !r.success);

  if (detailUploadFailed && !detailUploadFailed.success) {
    return { success: false, message: detailUploadFailed.message };
  }

  return {
    success: true,
    data: {
      bannerImageUrl: bannerUpload.data.activityImageUrl,
      subImageUrls: detailUploadRes.flatMap((detail) =>
        detail.success ? [detail.data.activityImageUrl] : []
      ),
    },
  };
};

export const findRemove = (
  detailRef: RefObject<ImgUploadRef | null>,
  initData: ActivityResponse
) => {
  const currentDetailUrls = detailRef.current?.getCurrentUrls?.() ?? [];
  const subImageIdsToRemove = initData.subImages
    .filter((img) => !currentDetailUrls.includes(img.imageUrl))
    .map((img) => img.id);

  return subImageIdsToRemove;
};
