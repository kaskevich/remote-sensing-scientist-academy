import type { Metadata } from "next";
import AdminPortal from "@/app/components/admin-portal";
import { academyLessonRoutes } from "@/lib/academy-routes";

export const metadata: Metadata = {
  title: "Academy administration | Remote Sensing Scientist Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  const lessons = academyLessonRoutes.map((lesson) => ({
    id: lesson.lessonId,
    title: `${lesson.lessonNumber} · ${lesson.title}`,
  }));

  return <AdminPortal lessons={lessons} />;
}
