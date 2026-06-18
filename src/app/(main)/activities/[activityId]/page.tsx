export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-6">
      <h1 className="text-3xl font-bold">체험 상세 페이지</h1>
      <p className="mt-4 text-gray-600">activityId: {activityId}</p>
    </main>
  );
}
