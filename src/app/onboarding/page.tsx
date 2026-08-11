import { redirect } from "next/navigation";
import OnboardingWizard from "./OnboardingWizard";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { getWorkspacesAction } from "@/actions/workspace.actions";

export default async function OnboardingPage() {
  const user = await getCurrentUserAction();
  if (!user) redirect("/login");

  const workspaces = await getWorkspacesAction();

  // The wizard sets up the user's first workspace. Returning users skip it.
  if (workspaces.length > 0) redirect("/dashboard");

  return <OnboardingWizard userName={user.name} />;
}
