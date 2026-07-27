# Academy content and privacy

The interface clearly separates four areas because they have different
audiences and storage rules.

| Area | Guest mode | Signed-in mode | Who can read it |
| --- | --- | --- | --- |
| Private learner notes | `localStorage` in the current browser | Supabase `lesson_notes` | The learner only |
| Learner submission | IndexedDB in the current browser | Supabase Postgres plus private Storage | The learner and assigned instructors |
| Submission conversation and feedback | Unavailable | Supabase Postgres | The learner and assigned instructors |
| Shared lesson discussion | Read prompt only | Supabase Postgres when enabled | Signed-in learners and instructors |

## Guest work

Guest completion, current lesson, personal notes, written task results, and
local attachments do not leave the browser. They do not synchronize across
devices and cannot be reviewed by an instructor. Clearing site data removes
them. On first sign-in, the Academy offers to copy local progress and notes into
the account; it does not delete the local copy.

## Signed-in work

Progress and notes are synchronized through Postgres. Submission files use a
private path based on the learner user ID and lesson ID. File metadata is stored
with the submission. Private downloads require an authenticated request that
passes Storage RLS.

Instructor resources use a different private bucket and metadata table.
Resources can be marked public, signed-in-only, or staff draft. Marketing and
repository-hosted public content remain managed through Pages CMS.

## File handling

Learner submissions accept up to five files per lesson. The initial limit is
50 MB per file and is configurable. Supported learner formats are PNG, JPEG,
WebP, GeoJSON, GeoTIFF, CSV, PDF, IPYNB, HTML, and ZIP. Images and GeoJSON have
inline previews. Other formats show metadata and a secure download action.

Client-side validation improves feedback but is not the security boundary. The
Storage bucket limits, database constraints, private buckets, user-scoped paths,
and RLS policies enforce the server-side boundary.
