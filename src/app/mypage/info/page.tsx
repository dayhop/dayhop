import { cookies } from 'next/headers';
import { SettingsForm } from '@/components/blocks/SettingsForm';

export default async function InfoPage() {
  const cookieStore = await cookies();
  const isOAuth = cookieStore.get('loginProvider')?.value === 'kakao';

  return <SettingsForm isOAuth={isOAuth} />;
}
