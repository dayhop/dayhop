import { cookies } from 'next/headers';
import { SettingsForm } from '@/components/blocks/SettingsForm';

export default async function InfoPage() {
  const cookieStore = await cookies();
  const loginProvider = cookieStore.get('loginProvider')?.value;
  const isOAuth = !!loginProvider && loginProvider !== 'email';

  return <SettingsForm isOAuth={isOAuth} />;
}
