import { describe, expect, it } from "vitest";
import {
  canManageDiscussionComment,
  canReadPrivateNote,
  canReadSubmission,
  canReadSubmissionConversation,
  type AcademyActor,
} from "../lib/access-control";

const learnerOne: AcademyActor = { id: "learner-1", role: "learner" };
const learnerTwo: AcademyActor = { id: "learner-2", role: "learner" };
const instructor: AcademyActor = {
  id: "instructor-1",
  role: "instructor",
  assignedLearnerIds: ["learner-1"],
};
const admin: AcademyActor = { id: "admin-1", role: "admin" };

describe("Academy privacy boundaries", () => {
  it("keeps private notes visible only to their learner", () => {
    expect(canReadPrivateNote(learnerOne, learnerOne.id)).toBe(true);
    expect(canReadPrivateNote(learnerTwo, learnerOne.id)).toBe(false);
    expect(canReadPrivateNote(instructor, learnerOne.id)).toBe(false);
    expect(canReadPrivateNote(admin, learnerOne.id)).toBe(false);
  });

  it("shares submissions and their private conversation only with assigned staff", () => {
    expect(canReadSubmission(learnerOne, learnerOne.id)).toBe(true);
    expect(canReadSubmission(learnerTwo, learnerOne.id)).toBe(false);
    expect(canReadSubmission(instructor, learnerOne.id)).toBe(true);
    expect(canReadSubmissionConversation(instructor, learnerOne.id)).toBe(true);
    expect(canReadSubmissionConversation(instructor, learnerTwo.id)).toBe(false);
    expect(canReadSubmission(admin, learnerOne.id)).toBe(true);
  });

  it("allows learners to manage their own discussion comments and staff to moderate", () => {
    expect(canManageDiscussionComment(learnerOne, learnerOne.id)).toBe(true);
    expect(canManageDiscussionComment(learnerTwo, learnerOne.id)).toBe(false);
    expect(canManageDiscussionComment(instructor, learnerOne.id)).toBe(true);
  });
});
