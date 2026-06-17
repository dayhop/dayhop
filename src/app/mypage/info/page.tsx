import { getMyUser } from '@/lib/api/users';

export default async function InfoPage() {
  const user = await getMyUser();

  return (
    <div>
      <h2 className="text-text-primary text-2xl font-bold">내 정보</h2>
      <pre className="mt-4 text-sm">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
