import { redirect } from "next/navigation";

/**
 * Root route — redirect straight to the adviser overview.
 */
export default function HomePage() {
  redirect("/adviser");
}
