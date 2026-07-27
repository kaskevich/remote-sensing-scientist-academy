import type { Metadata } from "next";
import content from "@/content/site.json";
import AdminPortal from "@/app/components/admin-portal";

export const metadata: Metadata = {
  title: "Academy administration | Remote Sensing Scientist Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  const lessons = content.curriculum.modules.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
  }));

  return <AdminPortal lessons={lessons} />;
}
