export type AcademyRole = "learner" | "instructor" | "admin";

export type AcademyProfile = {
  id: string;
  email: string | null;
  displayName: string;
  role: AcademyRole;
  localMigrationCompletedAt: string | null;
};

export type SubmissionStatus =
  | "not_reviewed"
  | "needs_revision"
  | "reviewed"
  | "approved";

export type SubmissionRecord = {
  id: string;
  userId: string;
  lessonId: string;
  writtenResult: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  updatedAt: string;
};

export type SubmissionFileRecord = {
  id: string;
  submissionId: string;
  userId: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type ConversationComment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};

export type InstructorFeedback = {
  id: string;
  submissionId: string;
  instructorId: string;
  status: SubmissionStatus;
  body: string;
  rubricScore: Record<string, number> | null;
  revisionNumber: number;
  createdAt: string;
};

export type ResourceVisibility = "public" | "authenticated" | "draft";

export type AcademyResource = {
  id: string;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  licenseSource: string;
  visibility: ResourceVisibility;
  ordering: number;
  createdAt: string;
};

export function isStaffRole(role: AcademyRole | null | undefined) {
  return role === "instructor" || role === "admin";
}
