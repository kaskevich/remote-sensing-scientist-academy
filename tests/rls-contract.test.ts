import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../supabase/migrations/202607270001_platform_foundation.sql", import.meta.url),
  "utf8",
).toLowerCase();

const exposedTables = [
  "profiles",
  "enrollments",
  "lesson_progress",
  "lesson_notes",
  "submissions",
  "submission_files",
  "submission_comments",
  "lesson_discussions",
  "discussion_comments",
  "instructor_feedback",
  "resource_files",
];

describe("Supabase RLS migration contract", () => {
  it.each(exposedTables)("enables RLS on %s", (table) => {
    expect(migration).toContain(`alter table public.${table} enable row level security`);
  });

  it("keeps notes owner-only and submissions enrollment-aware", () => {
    expect(migration).toContain('create policy "notes strictly private"');
    expect(migration).toContain("using (user_id = (select auth.uid()))");
    expect(migration).toContain("instructor_can_access_learner(user_id)");
  });

  it("uses private, separate buckets and user-scoped submission paths", () => {
    expect(migration).toContain("'learner-submissions'");
    expect(migration).toContain("'lesson-resources'");
    expect(migration).toContain("(storage.foldername(name))[1] = (select auth.uid())::text");
    expect(migration).toContain("public.can_read_resource_path(name)");
  });

  it("contains no service-role browser policy", () => {
    expect(migration).not.toContain("service_role");
  });

  it("uses explicit Academy grants and revokes default security-definer execution", () => {
    expect(migration).not.toContain("on all tables in schema public");
    expect(migration).toContain("revoke all on function public.current_academy_role() from public");
    expect(migration).toContain("revoke all on table");
  });
});
