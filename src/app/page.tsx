import { getCurrentUserAction } from '@/actions/auth.actions';
import LandingPage from '@/components/landing/LandingPage';

export default async function Landing() {
  const user = await getCurrentUserAction();
  return <LandingPage user={user} />;
}
