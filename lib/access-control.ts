import type { AcademyRole } from "./platform-types";

export type AcademyActor = {
  id: string;
  role: AcademyRole;
  assignedLearnerIds?: readonly string[];
};

export function canReadPrivateNote(actor: AcademyActor, noteOwnerId: string) {
  return actor.id === noteOwnerId;
}

export function canReadSubmission(actor: AcademyActor, submissionOwnerId: string) {
  return (
    actor.id === submissionOwnerId ||
    actor.role === "admin" ||
    (actor.role === "instructor" && actor.assignedLearnerIds?.includes(submissionOwnerId) === true)
  );
}

export function canReadSubmissionConversation(
  actor: AcademyActor,
  submissionOwnerId: string,
) {
  return canReadSubmission(actor, submissionOwnerId);
}

export function canManageDiscussionComment(
  actor: Pick<AcademyActor, "id" | "role">,
  authorId: string,
) {
  return actor.id === authorId || actor.role === "instructor" || actor.role === "admin";
}
