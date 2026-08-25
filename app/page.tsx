import type { Metadata } from "next";
import content from "@/content/site.json";
import { AcademyHome } from "@/lib/academy-platform";
import { lessonRouteById } from "@/lib/academy-routes";
import { JsonLd } from "@/app/components/platform-navigation";
import LegacyRouteRedirect from "@/app/components/legacy-route-redirect";
import { academyHref, academyUrl } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: { canonical: academyUrl("/") },
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.description,
    url: academyUrl("/"),
    type: "website",
  },
};

export default function HomePage() {
  const routeByLessonId = Object.fromEntries(
    Object.entries(lessonRouteById).map(([lessonId, lesson]) => [lessonId, academyHref(lesson.path)]),
  );
  return (
    <>
      <JsonLd value={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: content.metadata.title,
        url: academyUrl("/"),
        description: content.metadata.description,
      }} />
      <LegacyRouteRedirect routes={Object.fromEntries(
        Object.entries(lessonRouteById).map(([lessonId, lesson]) => [lessonId, academyHref(lesson.path)]),
      )} />
      <AcademyHome routeByLessonId={routeByLessonId} />
    </>
  );
}
